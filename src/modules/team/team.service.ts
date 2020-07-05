import { Injectable } from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamDTO } from './team.dto';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(private _teamRepository: TeamRepository) {}

  public getAllTeam(): Promise<TeamEntity[]> {
    return this._teamRepository.getAllTeam();
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
