import { Controller, Post, Body, Put, Param, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';
import { Pagination } from 'nestjs-typeorm-paginate';

import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamService } from './team.service';
import { TeamDTO } from './team.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';

@UseGuards(AuthenticationGuard)
@Controller('/api/v1/teams')
export class TeamController {
  constructor(private _teamService: TeamService) {}

  @Get('')
  public async getTeams(@Query('page') page: number, @Query('limit') limit: number): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._teamService.getTeams({ page, limit, route: '' });
  }

  @Get(':id')
  public getDetailTeam(@Param('id') id: number): Promise<ResponseModel> {
    return this._teamService.getDetailTeam(id);
  }

  @Post()
  public createTeam(@Body() team: TeamDTO): Promise<ResponseModel> {
    return this._teamService.createTeam(team);
  }

  @Put(':id')
  public updateTeam(@Param('id') id: number, @Body() data: TeamDTO): Promise<ResponseModel> {
    return this._teamService.updateTeam(id, data);
  }

  @Delete(':id')
  public deteleTeam(@Param('id') id: number): any {
    return this._teamService.deteleTeam(id);
  }
}
