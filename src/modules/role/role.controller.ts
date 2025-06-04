import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequiredPermissions } from 'src/auth/decorators/permission.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { RolePermissions } from 'src/auth/enums/role-permission.enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Auth(AuthType.Bearer)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequiredPermissions(RolePermissions.createRole)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @RequiredPermissions(RolePermissions.readRole)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @RequiredPermissions(RolePermissions.readRole)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @RequiredPermissions(RolePermissions.updateRole)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @RequiredPermissions(RolePermissions.deleteRole)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
