import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

@Injectable()
export class RolesPermissionsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.query(`
        TRUNCATE TABLE "role_permissions" RESTART IDENTITY CASCADE;
    `);
    const permissionRepository = dataSource.getRepository(Permission);
    const roleRepository = dataSource.getRepository(Role);
    const allPermissions = await permissionRepository.find();
    const superRole = await roleRepository.findOne({
      where: { name: 'super' },
    });
    const adminRole = await roleRepository.findOne({
      where: { name: 'admin' },
    });
    if (!adminRole || !superRole)
      throw new NotFoundException(
        `Error seeding permissions for the role "super" or "admin".`,
      );
    adminRole.permissions = allPermissions;
    superRole.permissions = allPermissions;
    await roleRepository.save(adminRole);
    await roleRepository.save(superRole);
  }
}
