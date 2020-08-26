import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { TeamDTO } from './team.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { TeamRepository } from './team.repository';
import { TEAM_EXIST } from '@app/constants/app.exeption';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class TeamService {
  constructor(private _teamRepository: TeamRepository, private _userRepository: UserRepository) {}

  public async getTeams(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._teamRepository.getTeams(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async searchTeam(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    text = text.toLowerCase();
    const data = await this._teamRepository.searchTeam(text, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getListTeams(): Promise<ResponseModel> {
    const adminTeamId = (await this._userRepository.getAdmin()).teamId;
    const data = await this._teamRepository.getListTeams(adminTeamId);
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
    const adminTeamId = (await this._userRepository.getAdmin()).teamId;
    const teams = await this._teamRepository.getListTeams(adminTeamId);
    const checkCycleExist = (teamParam) => teams.some(({ name }) => name == teamParam);
    if (checkCycleExist(data.name)) {
      throw new HttpException(TEAM_EXIST.message, TEAM_EXIST.statusCode);
    }
    const team = await this._teamRepository.createTeam(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: team,
    };
  }

  public async updateTeam(id: number, data: TeamDTO): Promise<ResponseModel> {
    const adminTeamId = (await this._userRepository.getAdmin()).teamId;
    const teams = await this._teamRepository.getListTeams(adminTeamId);
    const checkCycleExist = (teamParam, currentId) =>
      teams.some(({ name, id }) => name == teamParam && currentId !== id);
    if (checkCycleExist(data.name, id)) {
      throw new HttpException(TEAM_EXIST.message, TEAM_EXIST.statusCode);
    }
    const team = await this._teamRepository.updateTeam(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: team,
    };
  }

  public async deteleTeam(id: number): Promise<ResponseModel> {
    return await this._teamRepository.deteleTeam(id);
  }
}
