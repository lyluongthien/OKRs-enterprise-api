import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { UserRepository } from '../user/user.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, OKRsType, OKRsLeaderType, DeleteKeyresultType } from '@app/constants/app.enums';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { OKR_INVALID, DELETE_OKR, OKR_UPDATE_FAIL } from '@app/constants/app.exeption';
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
      const cycleId = (await this._cycleRepository.getCurrentCycle(new Date())).id;
      if (userId) {
        okrDTo.objective.userId = userId;
      }
      const listAlignment = await this._objectiveRepository.getListOKRs(cycleId, OKRsLeaderType.ALL);

      okrDTo.objective.alignObjectivesId.forEach((value) => {
        const alignmentExist = listAlignment.some(({ id }) => id === value);
        if (!alignmentExist) {
          throw new HttpException(OKR_INVALID.message, OKR_INVALID.statusCode);
        }
      });

      if (okrDTo.keyResult) {
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
          okrDTo.objective.progress = (sumDataObtained / sumDataTarget) * 100;
        }
        objectiveEntity = await this._objectiveRepository.createAndUpdateObjective(okrDTo.objective, manager);
        okrDTo.keyResult.map((value) => {
          value.objectiveId = objectiveEntity.id;
          return value.objectiveId;
        });
      }
      await this._keyResultRepository.createAndUpdateKeyResult(okrDTo.keyResult, manager);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: objectiveEntity.id,
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

  public async getListOKRsByUserId(userId: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.getOKRsByUserId(userId);
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
