import { Controller, Post, Body, Put, Param, Delete, Get, UseGuards } from '@nestjs/common';

import { TeamDTO } from './team.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';
import { ObjectLiteral } from 'typeorm';
import { RoleEnum } from '@app/constants/app.enums';
import { Roles } from '../role/role.decorator';
import { TeamService } from './team.service';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';

// @UseGuards(AuthenticationGuard)
@Controller('/api/v1/teams')
@SwaggerAPI()
export class TeamController {
  constructor(private _teamService: TeamService) {}

  @Get()
  public async getListTeams(): Promise<ResponseModel> {
    return this._teamService.getListTeams();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public getDetailTeam(@Param('id') id: number): Promise<ResponseModel> {
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
  public updateTeam(@Param('id') id: number, @Body() data: TeamDTO): Promise<ResponseModel> {
    return this._teamService.updateTeam(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public deteleTeam(@Param('id') id: number): Promise<ObjectLiteral> {
    return this._teamService.deteleTeam(id);
  }
}
