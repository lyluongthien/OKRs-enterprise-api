import { Controller, Get, Post, Put, Delete, Body, Res, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDTO } from './role.dto';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  showAllRole(): any {
    return this.roleService.getListRole();
  }

  @Post()
  createRole(@Body() role: RoleDTO): any {
    return this.roleService.createRole(role);
  }

  @Get(':id')
  getDetailRole(@Param('id') id: number): any {
    return this.roleService.getRoleDetail(id);
  }

  @Put(':id')
  updateRole(@Param('id') id: number, @Body() data: Partial<RoleDTO>): any {
    return this.roleService.updateRole(id, data);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: number): any {
    return this.roleService.deleteRole(id);
  }
}
