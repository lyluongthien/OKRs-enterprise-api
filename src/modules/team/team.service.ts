import { ObjectLiteral } from 'typeorm';
import { Injectable, HttpStatus } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { TeamRepository } from './team.repository';
import { TeamDTO } from './team.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class TeamService {
  constructor(private _teamRepository: TeamRepository) {}

  public getTeams(options: IPaginationOptions): Promise<ResponseModel> {
    const data = this._teamRepository.getTeams(options);
    return data;
  }

  public async getDetailTeam(id: number): Promise<ResponseModel> {
    const data = await this._teamRepository.getDetailTeam(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createTeam(data: TeamDTO): Promise<ResponseModel> {
    const team = await this._teamRepository.createTeam(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: team,
    };
  }

  public async updateTeam(id: number, data: TeamDTO): Promise<ResponseModel> {
    const team = await this._teamRepository.updateTeam(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: team,
    };
  }

  public deteleTeam(id: number): Promise<ObjectLiteral> {
    return this._teamRepository.deteleTeam(id);
  }
}
