import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  showAllRole(): any {
    return this.roleService.getListRole();
  }

  @Post()
  createRole(): any {
    return 'Phan duc';
  }

  @Get(':id')
  getDetailRole(): any {
    return 'Phan duc';
  }

  @Put(':id')
  updateRole(): any {
    return 'Phan duc';
  }

  @Delete(':id')
  deleteRole(): any {
    return 'Phan duc';
  }
}
