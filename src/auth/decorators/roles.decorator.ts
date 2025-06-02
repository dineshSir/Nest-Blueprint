import { SetMetadata } from '@nestjs/common';
import { ROLES_KEYS } from '../constants/auth-constants';
import { Role } from 'src/modules/role/entities/role.entity';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEYS, roles);
