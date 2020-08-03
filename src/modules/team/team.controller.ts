import { Controller, Post, Body, Put, Param, Delete, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';

import { TeamDTO } from './team.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';
import { RoleEnum } from '@app/constants/app.enums';
import { Roles } from '../role/role.decorator';
import { TeamService } from './team.service';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';

// @UseGuards(AuthenticationGuard)
@Controller('/api/v1/teams')
@SwaggerAPI()
export class TeamController {
  constructor(private _teamService: TeamService) {}

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public async getTeams(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    if (text) {
      return this._teamService.searchTeam(text, {
        page,
        limit,
        route: '',
      });
    }
    return this._teamService.getTeams({
      page,
      limit,
      route: '',
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public getTeamDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._teamService.getDetailTeam(id);
  }

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public createTeam(@Body() team: TeamDTO): Promise<ResponseModel> {
    return this._teamService.createTeam(team);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public updateTeam(@Param('id', ParseIntPipe) id: number, @Body() data: TeamDTO): Promise<ResponseModel> {
    console.log(typeof id);
    return this._teamService.updateTeam(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public deteleTeam(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._teamService.deteleTeam(id);
  }
}
