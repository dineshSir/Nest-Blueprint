import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from 'src/modules/role/entities/role.entity';
import { RolePermissions } from '../enums/role-permission.enum';
import { PERMISSIONS_KEY, REQUEST_USER_KEY } from '../constants/auth-constants';
import { ActiveUserData } from '../interfaces/active-user-data.interfce';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<
      RolePermissions[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const activeUser: ActiveUserData = request[REQUEST_USER_KEY];

    const activeUserRoles = activeUser?.roles || [];

    if (activeUserRoles.length === 0) return false;

    const roles = await this.roleRepository.find({
      where: { name: In(activeUserRoles) },
      relations: ['permissions'],
    });

    if (activeUserRoles.length !== roles.length)
      throw new NotFoundException(`Some user roles are not found.`);

    const userPermissions = [
      ...new Set(
        roles.flatMap((role) =>
          role.permissions.map((permission) => permission.name),
        ),
      ),
    ];
    return requiredPermission.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
