import { Controller, Post, Body, Put, Param, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';

import { TeamDTO } from './team.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';
import { ObjectLiteral } from 'typeorm';
import { RoleEnum } from '@app/constants/app.enums';
import { Roles } from '../role/role.decorator';
import { TeamService } from './team.service';

//@UseGuards(AuthenticationGuard)
@Controller('/api/v1/teams')
export class TeamController {
  constructor(private _teamService: TeamService) {}

  /**
   * @description: Get list of teams in company
   */
  @Get()
  @UseGuards(AuthenticationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public async getTeams(@Query('page') page: number, @Query('limit') limit: number): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._teamService.getTeams({
      page,
      limit,
      route: '',
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public getDetailTeam(@Param('id') id: number): Promise<ResponseModel> {
    return this._teamService.getDetailTeam(id);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public createTeam(@Body() team: TeamDTO): Promise<ResponseModel> {
    return this._teamService.createTeam(team);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public updateTeam(@Param('id') id: number, @Body() data: TeamDTO): Promise<ResponseModel> {
    return this._teamService.updateTeam(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public deteleTeam(@Param('id') id: number): Promise<ObjectLiteral> {
    return this._teamService.deteleTeam(id);
  }
}
