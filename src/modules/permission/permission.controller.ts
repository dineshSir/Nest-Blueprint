import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequiredPermissions } from 'src/auth/decorators/permission.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { RolePermissions } from 'src/auth/enums/role-permission.enum';
import { PermissionService } from './permission.service';

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
