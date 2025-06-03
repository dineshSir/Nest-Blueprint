import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { RolePermissions } from 'src/auth/enums/role-permission.enum';
import { RequiredPermissions } from 'src/auth/decorators/permission.decorator';

@Auth(AuthType.Bearer)
@RequiredPermissions(RolePermissions.readPermission)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }
}
