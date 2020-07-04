import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes } from '@nestjs/common';

import { RoleService } from './role.service';
import { RoleDTO } from './role.dto';
import { RoleEntity } from '@app/db/entities/role.entity';
import { ValidationPipe } from '@app/core/pipes/validation.pipe';
import { ApiBody } from '@nestjs/swagger';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  private createRole(@Body() role: RoleDTO): Promise<RoleEntity> {
    return this.roleService.createRole(role);
  }

  @Get(':id')
  private getDetailRole(@Param('id') id: number): Promise<RoleEntity> {
    return this.roleService.getRoleDetail(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  private updateRole(@Param('id') id: number, @Body() data: RoleDTO): Promise<RoleEntity> {
    return this.roleService.updateRole(id, data);
  }

  @Delete(':id')
  private deleteRole(@Param('id') id: number): any {
    return this.roleService.deleteRole(id);
  }
}
