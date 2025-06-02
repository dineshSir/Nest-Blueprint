import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../constants/auth-constants';
import { RolePermissions } from '../enums/role-permission.enum';

export const RequiredPermissions = (...permissions: RolePermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
