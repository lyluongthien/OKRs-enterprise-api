import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { UserRepository } from '../user/user.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { CommonMessage, OKRsType, OKRsLeaderType, DeleteKeyresultType } from '@app/constants/app.enums';
import {
  OKR_INVALID,
  DELETE_OKR,
  OKR_UPDATE_FAIL,
  KEYRESULT_INVALID,
  OKR_CYCLE_INVALID,
} from '@app/constants/app.exeption';
import { CycleRepository } from '../cycle/cycle.repository';

@Injectable()
export class ObjectiveService {
  constructor(
    private _objectiveRepository: ObjectiveRepository,
    private _userRepository: UserRepository,
    private _keyResultRepository: KeyResultRepository,
    private _cycleRepository: CycleRepository,
  ) {}

  public async createAndUpdateOKRs(okrDTo: OkrsDTO, manager: EntityManager, userId?: number): Promise<ResponseModel> {
    let objectiveEntity = null;
    if (okrDTo.objective) {
      if (okrDTo.objective.id) {
        const okrs = await this._objectiveRepository.getDetailOKRs(okrDTo.objective.id);
        if (!okrs) throw new HttpException(OKR_INVALID.message, OKR_INVALID.statusCode);
      }
      let cycleId = okrDTo.objective.cycleId;
      if (cycleId) {
        const cycle = await this._cycleRepository.getCycleDetail(cycleId);
        const today = new Date().getTime();
        const cycleDate = new Date(cycle.endDate).getTime();
        if (today > cycleDate) {
          throw new HttpException(OKR_CYCLE_INVALID.message, OKR_CYCLE_INVALID.statusCode);
        }
      }
      if (userId) {
        okrDTo.objective.userId = userId;
      }

      if (okrDTo.objective.alignObjectivesId) {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const date = year + '-' + month + '-' + day;
        if (!cycleId) cycleId = (await this._cycleRepository.getCurrentCycle(date)).id;
        const listAlignment = await this._objectiveRepository.getListOKRs(cycleId, OKRsLeaderType.ALL);

        okrDTo.objective.alignObjectivesId = okrDTo.objective.alignObjectivesId.filter((value, index) => {
          const alignmentExist = listAlignment.some(({ id }) => id === value);
          if (!alignmentExist) {
            throw new HttpException(OKR_INVALID.message, OKR_INVALID.statusCode);
          }
          return okrDTo.objective.alignObjectivesId.indexOf(value) === index;
        });
      }

      if (okrDTo.keyResult) {
        if (okrDTo.keyResult.length < 1) {
          throw new HttpException(KEYRESULT_INVALID.message, KEYRESULT_INVALID.statusCode);
        }
        let sumDataTarget = 0,
          sumDataObtained = 0;
        okrDTo.keyResult.map((value) => {
          if (
            value.valueObtained > value.targetValue ||
            value.valueObtained > Number.MAX_SAFE_INTEGER ||
            value.targetValue > Number.MAX_SAFE_INTEGER ||
            value.startValue > Number.MAX_SAFE_INTEGER ||
            value.valueObtained < 0 ||
            value.targetValue <= 0 ||
            value.startValue < 0 ||
            value.startValue > value.targetValue
          ) {
            throw new HttpException(OKR_UPDATE_FAIL.message, OKR_UPDATE_FAIL.statusCode);
          }
          sumDataTarget += value.targetValue;
          sumDataObtained += value.valueObtained;
          return value.objectiveId;
        });
        if (sumDataTarget > 0 && sumDataObtained > 0) {
          okrDTo.objective.progress = Math.floor((sumDataObtained / sumDataTarget) * 100);
        }
        objectiveEntity = await this._objectiveRepository.createAndUpdateObjective(okrDTo.objective, manager);
        okrDTo.keyResult.map((value) => {
          value.objectiveId = objectiveEntity.id;
          return value.objectiveId;
        });
        await this._keyResultRepository.createAndUpdateKeyResult(okrDTo.keyResult, manager);
      }
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: objectiveEntity ? objectiveEntity.id : -1,
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

  public async getListOKRs(cycleId: number, type: OKRsLeaderType): Promise<ResponseModel> {
    const data = await this._objectiveRepository.getListOKRs(cycleId, type);
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

    const adminId = (await this._userRepository.getAdmin()).id;
    let teamOKRs = [];
    if (adminId != userId) {
      const teamLeadId = (await this._userRepository.getTeamLeader(userId)).id;
      if (teamLeadId) teamOKRs = await this._objectiveRepository.viewListOKRs(cycleId, OKRsType.TEAM, teamLeadId);
    }
    data.personal = await this._objectiveRepository.viewListOKRs(cycleId, OKRsType.PERSONAL, userId);
    data.team = teamOKRs;
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
    } else throw new HttpException(OKR_INVALID.message, OKR_INVALID.statusCode);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getListOKRsByUserId(userId: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.getOKRsByUserId(userId);
    if (!data) {
      throw new HttpException(OKR_INVALID.message, OKR_INVALID.statusCode);
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
      const okrsExist = await this._objectiveRepository.getDetailOKRs(objectiveId);
      if (okrsExist.childObjectives) throw new HttpException(DELETE_OKR.message, DELETE_OKR.statusCode);
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
