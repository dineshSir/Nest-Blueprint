import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';

// @Auth(AuthType.None)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create() {
    return this.permissionService.create();
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne() {
    return this.permissionService.findOne();
  }

  @Patch(':id')
  update() {
    return this.permissionService.update();
  }

  @Delete(':id')
  remove() {
    return this.permissionService.remove();
  }
}
