import { Injectable } from '@nestjs/common';
import { RolePermissions } from 'src/auth/enums/role-permission.enum';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

@Injectable()
export class PermissionsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const permissionRepository = dataSource.getRepository(Permission);
    await dataSource.query(
      `TRUNCATE TABLE "permission" RESTART IDENTITY CASCADE`,
    );

    const permissions = Object.values(RolePermissions).map((permission) => ({
      name: permission,
    }));

    await permissionRepository.save(permissions);
  }
}
