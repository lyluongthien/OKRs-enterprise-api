import { ObjectLiteral } from 'typeorm';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { TeamDTO } from './team.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { TeamRepository } from './team.repository';
import { TEAM_EXIST } from '@app/constants/app.exeption';

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

  public async searchTeam(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._teamRepository.searchTeam(text, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getListTeams(): Promise<ResponseModel> {
    const data = await this._teamRepository.getListTeams();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
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
    const teams = await this._teamRepository.getListTeams();
    const checkCycleExist = (teamParam) => teams.some(({ name }) => name == teamParam);
    if (checkCycleExist(data.name)) {
      throw new HttpException(TEAM_EXIST.message, TEAM_EXIST.statusCode);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: team,
    };
  }

  public async updateTeam(id: number, data: TeamDTO): Promise<ResponseModel> {
    const team = await this._teamRepository.updateTeam(id, data);
    const teams = await this._teamRepository.getListTeams();
    const checkCycleExist = (teamParam) => teams.some(({ name }) => name == teamParam);
    if (checkCycleExist(data.name)) {
      throw new HttpException(TEAM_EXIST.message, TEAM_EXIST.statusCode);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: team,
    };
  }

  public async deteleTeam(id: number): Promise<ObjectLiteral> {
    return await this._teamRepository.deteleTeam(id);
  }
}
