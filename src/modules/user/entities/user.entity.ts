import { IsPhoneNumber } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  // @Column({ nullable: true })
  // firstName: string;

  // @Column({ nullable: true })
  // middileName: string;

  // @Column({ nullable: true })
  // lastName: string;

  // @Column()
  // phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  //this was for Role Guard
  // @Column({ enum: Role, default: Role.Regular })
  // role: Role;

  @ManyToMany(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  roles: Role[];
}
