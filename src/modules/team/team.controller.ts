import { Controller, Post, Body, Put, Param, Delete, Get, UseGuards } from '@nestjs/common';
import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamService } from './team.service';
import { TeamDTO } from './team.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/roles.decorator';
import { RoleEnum } from '@app/constants/app.enums';

@Controller('/api/v1/teams')
export class TeamController {
  constructor(private _teamService: TeamService) {}

  @Get()
  private getAllTeam(): Promise<TeamEntity[]> {
    return this._teamService.getAllTeam();
  }

  @Get(':id')
  private getDetailTeam(@Param('id') id: number): Promise<TeamEntity> {
    return this._teamService.getDetailTeam(id);
  }

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  private createTeam(@Body() team: TeamDTO): Promise<TeamEntity> {
    return this._teamService.createTeam(team);
  }

  @Put(':id')
  private updateTeam(@Param('id') id: number, @Body() data: TeamDTO): Promise<TeamEntity> {
    return this._teamService.updateTeam(id, data);
  }

  @Delete(':id')
  private deteleTeam(@Param('id') id: number): any {
    return this._teamService.deteleTeam(id);
  }
}
