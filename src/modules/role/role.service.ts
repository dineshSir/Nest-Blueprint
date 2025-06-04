import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { safeError } from 'src/common/helper-functions/safe-error.helper';
import { runInTransaction } from 'src/common/helper-functions/transaction.helper';
import { In, QueryRunner, Repository } from 'typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(
    createRoleDto: CreateRoleDto,
  ): Promise<{ success: boolean; message: string }> {
    const [message, error] = await safeError(
      runInTransaction(async (queryRunner) => {
        const roleExists = await this.findWithName(
          createRoleDto.name,
          queryRunner,
        );
        if (roleExists)
          throw new ConflictException(
            `Role with name : ${createRoleDto.name} already exists.`,
          );

        const roleRepository = queryRunner.manager.getRepository(Role);
        const { permissionIds } = createRoleDto;
        const permissionInstances = await queryRunner.manager.find(Permission, {
          where: { id: In(permissionIds) },
        });

        const foundPermissionIds = permissionInstances.map(
          (permissionInstance: Permission) => permissionInstance.id,
        );

        const missingPermissionIds = permissionIds.filter(
          (id: number) => !foundPermissionIds.includes(id),
        );
        if (missingPermissionIds.length > 0)
          throw new NotFoundException(
            `Permission/s not found for id/s: ${missingPermissionIds.join(', ')}`,
          );

        const newRole = new Role();
        Object.assign(newRole, omit(createRoleDto, ['permissionIds']));

        const role = roleRepository.create({
          ...newRole,
          permissions: permissionInstances,
        });

        const savedRole = await roleRepository.save(role);
        return {
          success: true,
          message: `Role created successfully.`,
        };
      }),
    );
    if (error instanceof HttpException) throw error;
    return message!;
  }

  async findAll(): Promise<Role[]> {
    const [roles, error] = await safeError(
      this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permission')
        .select(['role.id', 'role.name', 'permission.id', 'permission.name'])
        .getMany(),
    );
    if (error) {
      throw new InternalServerErrorException('Error while fetching roles');
    }
    return roles;
  }

  async findOne(id: number, queryRunner?: QueryRunner): Promise<Role> {
    const roleRepository = queryRunner
      ? queryRunner.manager.getRepository(Role)
      : this.roleRepository;
    const [role, error] = await safeError(
      roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permission')
        .where('vacancy.id = :id', { id })
        .select([
          'role.id',
          'role.name',
          'role.description',
          'permission.id',
          'permission.name',
        ])
        .getOne(),
    );
    if (error) {
      throw new InternalServerErrorException('Error while fetching roles');
    }
    if (!role) throw new NotFoundException(`Role with id : ${id} not found.`);
    return role;
  }

  async findWithName(
    name: string,
    queryRunner?: QueryRunner,
  ): Promise<Role | null> {
    const roleRepository = queryRunner
      ? queryRunner.manager.getRepository(Role)
      : this.roleRepository;
    const [role, error] = await safeError(
      roleRepository.findOne({ where: { name } }),
    );
    if (error)
      throw new InternalServerErrorException('Error while retreiving role.');
    if (!role) return null;
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // const [message, error] = await safeError(
    //   runInTransaction(async (queryRunner) => {
    //     const roleRepository = queryRunner.manager.getRepository(Role);
    //     const existingRole = await this.findOne(id, queryRunner);
    //     const existingPermissionIds = existingRole.permissions.map(
    //       (permission) => permission.id,
    //     );
    //     const incommingPermissionIds = updateRoleDto.permissionIds;
    //     const role = this.findOne(id, queryRunner);
    //     Object.assign(role, updateRoleDto);
    //   }),
    // );
    // const role = await this.findOne(id);
    // if (updateRoleDto.name) {
    //   if (updateRoleDto.name !== role.name) {
    //     const existingRole = await this.roleRepository.findOne({
    //       where: { name: updateRoleDto.name },
    //     });
    //     if (existingRole) {
    //       throw new ConflictException(
    //         `Role ${updateRoleDto.name} already exists`,
    //       );
    //     }
    //     role.name = updateRoleDto.name;
    //   }
    // }
    // if (updateRoleDto.permissions) {
    //   const [assignedPermissions, err] = await safeError(
    //     this.permissionRepository.find({
    //       where: { name: In(updateRoleDto.permissions) },
    //     }),
    //   );
    //   if (!assignedPermissions) {
    //     throw new BadRequestException('Invalid permissions');
    //   }
    //   if (
    //     assignedPermissions.length === 0 ||
    //     assignedPermissions.length !== updateRoleDto.permissions.length
    //   ) {
    //     throw new BadRequestException('Invalid permissions');
    //   }
    //   if (err) {
    //     throw new InternalServerErrorException(
    //       'Error while fetching permissions',
    //     );
    //   }
    //   role.permissions = assignedPermissions;
    // }
    // return runInTransaction(async (queryRunner) =>
    //   queryRunner.manager.save(Role, role),
    // );
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const role = await this.findOne(id);
    if (role.name == 'super' || role.name == 'admin')
      throw new ForbiddenException(
        `Role 'super' or 'admin' can not be deleted. `,
      );
    const [deletedRole, Error] = await safeError(
      this.roleRepository.softRemove(role),
    );
    if (Error) throw new InternalServerErrorException(`Error deleting role.`);
    return {
      success: true,
      message: `Role ${role.name} deleted successfully.`,
    };
  }
}
