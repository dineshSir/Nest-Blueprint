import { Injectable, NotFoundException } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor() {}
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    await dataSource.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);

    const roles = await roleRepository.find({
      where: [{ name: 'super' }, { name: 'admin' }, { name: 'regular' }],
    });

    const getRole = (roleName: string) => {
      const role = roles.find((r) => r.name === roleName);
      if (!role) {
        throw new NotFoundException(`Role "${roleName}" not found.`);
      }
      return role;
    };

    const superRole = getRole('super');
    const adminRole = getRole('admin');
    const regularRole = getRole('regular');

    const usersData = [
      { email: 'aaaaa@aaaaa.com', role: superRole },
      { email: 'bbbbb@bbbbb.com', role: adminRole },
      { email: 'ccccc@ccccc.com', role: regularRole },
      { email: 'ddddd@ddddd.com', role: regularRole },
    ];

    const users = await Promise.all(
      usersData.map(async ({ email, role }) =>
        userRepository.create({
          email,
          password: await hash(email, await genSalt()),
          roles: [role],
        }),
      ),
    );

    await userRepository.save(users);
  }
}
