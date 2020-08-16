import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { UserRepository } from '../user/user.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, OKRsType, OKRsLeaderType, DeleteKeyresultType } from '@app/constants/app.enums';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { OKR_INVALID, DELETE_OKR } from '@app/constants/app.exeption';

@Injectable()
export class ObjectiveService {
  constructor(
    private _objectiveRepository: ObjectiveRepository,
    private _userRepository: UserRepository,
    private _keyResultRepository: KeyResultRepository,
    private _cycleRepository: CycleRepository,
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

  public async getParentOKRs(cycleId: number, type: OKRsLeaderType): Promise<ResponseModel> {
    let data = null;
    data = await this._objectiveRepository.getParentOKRs(cycleId, type);
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

  public async getListOKRs(): Promise<ResponseModel> {
    const currentCycleId = (await this._cycleRepository.getCurrentCycle(new Date())).id;
    const data = await this._objectiveRepository.getOKRsByCycleId(currentCycleId);
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
    if (data) {
      if (data.keyResults) {
        data.keyResults.map((value) => {
          if (value.targetValue > 0) {
            value.progress = Math.floor((value.valueObtained / value.targetValue) * 100);
          } else {
            value.progress = 0;
          }
          return data;
        });
      }
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async deleteOKRs(objectiveId: number, userId: number, manager: EntityManager): Promise<ResponseModel> {
    let rowEffected = 0;
    if (objectiveId && manager && userId) {
      const okrsIds = await this._objectiveRepository.getListOKRsIds();
      const okrsExist = okrsIds.some(({ id }) => id === objectiveId);
      if (!okrsExist) {
        throw new HttpException(OKR_INVALID.message, OKR_INVALID.statusCode);
      }
      const okrValidIds = await this._objectiveRepository.getOKRsByUserId(userId);
      const okrValidIdsExist = okrValidIds.some(({ id }) => id == objectiveId);
      if (!okrValidIdsExist) {
        throw new HttpException(DELETE_OKR.message, DELETE_OKR.statusCode);
      }
      const deleteKeyresults = await this._keyResultRepository.deleteKeyResults(
        objectiveId,
        DeleteKeyresultType.OKR,
        manager,
      );
      const deleteObjective = await this._objectiveRepository.deleteObjective(objectiveId, manager);
      if (deleteObjective == 1 && deleteKeyresults) rowEffected = 1;
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: rowEffected,
    };
  }
}
