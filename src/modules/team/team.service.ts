import { ObjectLiteral } from 'typeorm';
import { Injectable, HttpStatus } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamRepository } from './team.repository';
import { TeamDTO } from './team.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';

@Injectable()
export class TeamService {
  constructor(private _teamRepository: TeamRepository) {}

  public async getTeams(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._teamRepository.getTeams(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
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

  public async deteleTeam(id: number): Promise<ObjectLiteral> {
    return await this._teamRepository.deteleTeam(id);
  }
}
