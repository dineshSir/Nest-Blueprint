import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { omit } from 'lodash';
import { In } from 'typeorm';
import { runInTransaction } from 'src/common/helper-functions/transaction.helper';
import { Permission } from '../permission/entities/permission.entity';
import { safeError } from 'src/common/helper-functions/safe-error.helper';

@Injectable()
export class RoleService {
  constructor() {}
  async create(createRoleDto: CreateRoleDto) {
    const [message, error] = await safeError(
      runInTransaction(async (queryRunner) => {
        const roleRepository = queryRunner.manager.getRepository(Role);

        const [roleExists, error] = await safeError(
          roleRepository.findOne({
            where: { name: createRoleDto.name },
          }),
        );
        if (error)
          throw new InternalServerErrorException(
            `Error while checking if role already exists.`,
          );

        if (roleExists)
          throw new ConflictException(
            `Role ${createRoleDto.name} already exists`,
          );

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
    return message;
  }

  // async findAll(): Promise<Role[]> {
  //   // const [roles, error] = await safeError(
  //   //   this.roleRepository.find({
  //   //     relations: ['permissions'],
  //   //   }),
  //   // );
  //   // if (!roles) {
  //   //   throw new NotFoundException('No roles found');
  //   // }
  //   // if (roles.length === 0) {
  //   //   throw new NotFoundException('No roles found');
  //   // }
  //   // if (error) {
  //   //   throw new InternalServerErrorException('Error while fetching roles');
  //   // }
  //   // return roles;
  // }

  async findOne(id: number): Promise<Role> {
    const [role, error] = await safeError(
      runInTransaction(async (queryRunner) => {
        const roleRepository = queryRunner.manager.getRepository(Role);
        const foundRole = await roleRepository.findOne({ where: { id } });
        return foundRole;
      }),
    );
    if (error instanceof HttpException)
      throw new InternalServerErrorException('Error while retreiving role.');
    if (!role) throw new NotFoundException(`Role not found.`);
    return role;
  }
  async findWithName(name: string): Promise<Role> {
    const [role, error] = await safeError(
      runInTransaction(async (queryRunner) => {
        const roleRepository = queryRunner.manager.getRepository(Role);
        const foundRole = await roleRepository.findOne({ where: { name } });
        return foundRole;
      }),
    );
    if (error instanceof HttpException)
      throw new InternalServerErrorException('Error while retreiving role.');
    if (!role) throw new NotFoundException(`Role not found.`);
    return role;
  }
  // async update(
  //   id: number,
  //   updateRoleDto: UpdateRoleDto,
  // ): Promise<Role | UpdateResult> {
  //   const role = await this.findOne(id);
  //   if (updateRoleDto.name) {
  //     if (updateRoleDto.name !== role.name) {
  //       const existingRole = await this.roleRepository.findOne({
  //         where: { name: updateRoleDto.name },
  //       });
  //       if (existingRole) {
  //         throw new ConflictException(
  //           `Role ${updateRoleDto.name} already exists`,
  //         );
  //       }
  //       role.name = updateRoleDto.name;
  //     }
  //   }
  //   if (updateRoleDto.permissions) {
  //     const [assignedPermissions, err] = await safeError(
  //       this.permissionRepository.find({
  //         where: { name: In(updateRoleDto.permissions) },
  //       }),
  //     );
  //     if (!assignedPermissions) {
  //       throw new BadRequestException('Invalid permissions');
  //     }
  //     if (
  //       assignedPermissions.length === 0 ||
  //       assignedPermissions.length !== updateRoleDto.permissions.length
  //     ) {
  //       throw new BadRequestException('Invalid permissions');
  //     }
  //     if (err) {
  //       throw new InternalServerErrorException(
  //         'Error while fetching permissions',
  //       );
  //     }
  //     role.permissions = assignedPermissions;
  //   }
  //   return runInTransaction(async (queryRunner) =>
  //     queryRunner.manager.save(Role, role),
  //   );
  // }
  // async remove(id: number): Promise<string> {
  //   const role = await this.findOne(id);
  //   runInTransaction(async (queryRunner) =>
  //     queryRunner.manager.softRemove(Role, role),
  //   );
  //   return `${role.name} Role deleted successfully`;
  // }
}
