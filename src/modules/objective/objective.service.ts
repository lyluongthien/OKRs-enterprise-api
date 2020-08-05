import { Injectable, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { UserRepository } from '../user/user.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, OKRsType } from '@app/constants/app.enums';

@Injectable()
export class ObjectiveService {
  constructor(private _objectiveRepository: ObjectiveRepository, private _userRepository: UserRepository) {}

  public async createAndUpdateOKRs(okrDTo: OkrsDTO, manager: EntityManager, userID: number): Promise<ResponseModel> {
    await this._objectiveRepository.createAndUpdateOKRs(okrDTo, manager, userID);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }

  public async searchOKRs(cycleID: number, id: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.searchOKRs(cycleID, id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getAllTeamLeaderOKRs(cycleId: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.getAllTeamLeaderOKRs(cycleId);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async viewListOKRs(cycleID: number, userId: number): Promise<ResponseModel> {
    const data: any = {};
    const teamLeadId = (await this._userRepository.getTeamLeaderId(userId)).id;

    data.personal = await this._objectiveRepository.viewListOKRs(cycleID, OKRsType.PERSONAL, userId);
    data.team = await this._objectiveRepository.viewListOKRs(cycleID, OKRsType.TEAM, teamLeadId);
    data.root = await this._objectiveRepository.viewListOKRs(cycleID, OKRsType.ROOT);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getDetailOKRs(id: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.getDetailOKRs(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
  public async deleteOKRs(id: number): Promise<ResponseModel> {
    const rowEffected: string = (await this._objectiveRepository.deleteOKRs(id)).toString();
    if (rowEffected === '1')
      return {
        statusCode: HttpStatus.OK,
        message: CommonMessage.SUCCESS,
        data: { isDeleted: true },
      };
    return { statusCode: HttpStatus.OK, message: CommonMessage.DELETE_FAIL, data: { isDeleted: false } };
  }
}
