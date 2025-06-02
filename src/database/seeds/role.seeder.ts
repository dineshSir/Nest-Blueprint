import { Injectable } from '@nestjs/common';
import { Role } from 'src/modules/role/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

@Injectable()
export class RolesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    await dataSource.query(`TRUNCATE TABLE "role" RESTART IDENTITY CASCADE`);

    await roleRepository.save([
      {
        name: 'super',
      },
      {
        name: 'admin',
      },

      {
        name: 'employee', //remove in production
      },
      {
        name: 'regular', //remove in production
      },
    ]);
  }
}
