import { Injectable, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { UserRepository } from '../user/user.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, OKRsType, OKRsLeaderType } from '@app/constants/app.enums';
import { KeyResultRepository } from '../keyresult/keyresult.repository';

@Injectable()
export class ObjectiveService {
  constructor(
    private _objectiveRepository: ObjectiveRepository,
    private _userRepository: UserRepository,
    private _keyResultRepository: KeyResultRepository,
  ) {}

  public async createAndUpdateOKRs(okrDTo: OkrsDTO, manager: EntityManager, userId?: number): Promise<ResponseModel> {
    if (userId) {
      okrDTo.objective.userId = userId;
    }
    if (okrDTo.keyResult) {
      let sumDataTarget = 0,
        sumDataObtained = 0;
      okrDTo.keyResult.map((value) => {
        sumDataTarget += value.targetValue;
        sumDataObtained += value.valueObtained;
        return value.objectiveId;
      });
      if (sumDataTarget > 0 && sumDataObtained > 0) {
        okrDTo.objective.progress = (sumDataObtained / sumDataTarget) * 100;
      }
      const objectiveEntity = await this._objectiveRepository.createAndUpdateObjective(okrDTo.objective, manager);
      okrDTo.keyResult.map((value) => {
        value.objectiveId = objectiveEntity.id;
        return value.objectiveId;
      });
    }
    await this._keyResultRepository.createAndUpdateKeyResult(okrDTo.keyResult, manager);

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }

  public async searchOKRs(cycleId: number, id: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.searchOKRs(cycleId, id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getTeamLeaderOKRs(id: number, type: OKRsLeaderType): Promise<ResponseModel> {
    let data = null;
    if (type == OKRsLeaderType.CURRENT) {
      const teamLeadId = (await this._userRepository.getTeamLeaderId(id)).id;
      data = await this._objectiveRepository.getTeamLeaderOKRs(teamLeadId, type);
    } else {
      data = await this._objectiveRepository.getTeamLeaderOKRs(id, type);
    }
    if (data) {
      data.map((value) => {
        const email = value.user.email.split('@');
        if (email) {
          value.user.email = email[0];
        }
        return data;
      });
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async viewListOKRs(cycleId: number, userId: number): Promise<ResponseModel> {
    const data: any = {};
    const teamLeadId = (await this._userRepository.getTeamLeaderId(userId)).id;

    data.personal = await this._objectiveRepository.viewListOKRs(cycleId, OKRsType.PERSONAL, userId);
    data.team = await this._objectiveRepository.viewListOKRs(cycleId, OKRsType.TEAM, teamLeadId);
    data.root = await this._objectiveRepository.viewListOKRs(cycleId, OKRsType.ROOT);
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
