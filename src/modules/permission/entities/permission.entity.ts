import { CommonEntity } from "src/common/entities/common.entity";
import { Role } from "src/modules/role/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class Permission extends CommonEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: "role_permissions",
    joinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
  })
  roles: Role[];
}
