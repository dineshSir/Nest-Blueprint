import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { safeError } from 'src/common/helper-functions/safe-error.helper';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async findAll() {
    const [permissions, error] = await safeError(
      this.permissionRepository.find(),
    );
    if (error) {
      throw new InternalServerErrorException(
        `Error While fetching permissions`,
      );
    }
    return {
      success: true,
      message: `Permissions retreived successfully.`,
      data: permissions,
    };
  }

  async findOne(id: number) {
    const [permission, error] = await safeError(
      this.permissionRepository.findOne({
        select: ['id', 'name'],
        where: { id },
      }),
    );
  }
}
