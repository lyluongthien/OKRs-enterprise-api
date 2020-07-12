import { ObjectLiteral } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamRepository } from './team.repository';
import { TeamDTO } from './team.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class TeamService {
  constructor(private _teamRepository: TeamRepository) {}

  public getTeams(options: IPaginationOptions): Promise<Pagination<TeamEntity>> {
    return this._teamRepository.getTeams(options);
  }

  public getDetailTeam(id: number): Promise<TeamEntity> {
    return this._teamRepository.getDetailTeam(id);
  }

  public createTeam(data: TeamDTO): Promise<TeamEntity> {
    return this._teamRepository.createTeam(data);
  }

  public updateTeam(id: number, data: TeamDTO): Promise<TeamEntity> {
    return this._teamRepository.updateTeam(id, data);
  }

  public deteleTeam(id: number): Promise<ObjectLiteral> {
    return this._teamRepository.deteleTeam(id);
  }
}
