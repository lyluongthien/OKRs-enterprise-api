import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { CheckinRepository } from './checkin.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, ConfidentLevel } from '@app/constants/app.enums';
import { CreateCheckinDTO } from './checkin.dto';
import { EntityManager } from 'typeorm';
import { UserRepository } from '../user/user.repository';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { isNotEmptyObject } from 'class-validator';
import { ObjectiveRepository } from '../objective/objective.repository';

@Injectable()
export class CheckinService {
  constructor(
    private readonly _checkinRepository: CheckinRepository,
    private _userRepository: UserRepository,
    private _keyResultRepository: KeyResultRepository,
    private _objectiveRepository: ObjectiveRepository,
  ) {}

  public async getCheckinDetail(checkinId: number): Promise<ResponseModel> {
    const checkin = await this._checkinRepository.getCheckinById(checkinId);

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: checkin,
    };
  }

  public async getHistoryCheckin(objectiveId: number): Promise<ResponseModel> {
    const data = await this._checkinRepository.getCheckinByObjectiveId(objectiveId);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createUpdateCheckin(
    data: CreateCheckinDTO,
    manager: EntityManager,
    userId?: number,
  ): Promise<ResponseModel> {
    if (!isNotEmptyObject(data)) {
      throw new HttpException(CommonMessage.BODY_EMPTY, HttpStatus.PAYMENT_REQUIRED);
    }

    let checkinModel = null;
    if (userId && data.checkin) {
      const isLeader = (await this._userRepository.getUserByID(userId)).isLeader;
      if (isLeader) {
        data.checkin.teamLeaderId = (await this._userRepository.getAdmin()).id;
      } else {
        data.checkin.teamLeaderId = (await this._userRepository.getTeamLeaderId(userId)).id;
      }
      checkinModel = await this._checkinRepository.createUpdateCheckin(data.checkin, manager);
    }
    console.log(checkinModel);

    const keyResultValue = [];
    let checkinDetailModel = null;
    if (data.checkinDetails) {
      data.checkinDetails.map((value) => {
        keyResultValue.push({ id: value.keyResultId, valueObtained: value.valueObtained });
        value.checkinId = checkinModel.id;
        return value;
      });
      checkinDetailModel = await this._checkinRepository.createUpdateCheckinDetail(data.checkinDetails, manager);
    }
    // await this._keyResultRepository.createAndUpdateKeyResult(keyResultValue, manager);
    const dataResponse = {
      checkin: checkinModel,
      checkin_details: checkinDetailModel,
    };
    console.log(dataResponse);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }

  public async getCheckinRequest(userId: number, cycleId: number): Promise<ResponseModel> {
    let message = null;
    let data = null;
    const user = await this._userRepository.getUserByID(userId);
    const team = {
      id: user.teamId,
      isTeamLeader: user.isLeader,
    };
    if (team.isTeamLeader) {
      message = CommonMessage.SUCCESS;
      data = await this._checkinRepository.getCheckinRequest(team.id, cycleId);
    } else {
      message = CommonMessage.NOT_TEAM_LEADER;
      data = {};
    }
    return {
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    };
  }

  public async getWeeklyCheckin(): Promise<ResponseModel> {
    const today = new Date('2020-08-12');
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const todayValue = today.getTime();
    const lastWeekValue = lastWeek.getTime();
    const currentWeekIds = [],
      lastWeekIds = [];
    const data = [];
    const confidentLevel = [ConfidentLevel.BAD, ConfidentLevel.GOOD, ConfidentLevel.NORMAL];
    let dataLastWeek = null;
    const checkins = await this._checkinRepository.getCheckin();
    if (checkins) {
      checkins.map((value) => {
        if (todayValue >= value.checkinAt.getTime() && todayValue < value.nextCheckinDate.getTime()) {
          currentWeekIds.push(value.id);
        }
        if (lastWeekValue >= value.checkinAt.getTime() && lastWeekValue < value.nextCheckinDate.getTime()) {
          lastWeekIds.push(value.id);
        }
        return value;
      });
      if (lastWeekIds.length > 1) {
        dataLastWeek = await this._checkinRepository.getWeeklyCheckin(lastWeekIds);
      }
      if (currentWeekIds.length > 1) {
        const dataCurrentWeek = await this._checkinRepository.getWeeklyCheckin(currentWeekIds);
        dataCurrentWeek.map((CurrentWeekValue) => {
          const subData: any = {};
          confidentLevel.some((value) => {
            const levelExist = (param) => dataCurrentWeek.some(({ confidentLevel }) => param == confidentLevel);
            if (levelExist(value)) {
              subData.confidentLevel = CurrentWeekValue.confidentLevel;
              subData.numberoflevel = CurrentWeekValue.numberoflevel;
            } else {
              subData.confidentLevel = value;
            }
            return value;
          });
          if (dataLastWeek) {
            confidentLevel.some((value) => {
              const levelExist = (param) => dataLastWeek.some(({ confidentLevel }) => param == confidentLevel);
              if (levelExist(value)) {
                dataLastWeek.some(({ confidentLevel, numberoflevel }) => {
                  if (CurrentWeekValue.confidentLevel == confidentLevel) {
                    subData.changing = CurrentWeekValue.numberoflevel - numberoflevel;
                  } else {
                    subData.changing = CurrentWeekValue.numberoflevel;
                  }
                  return { confidentLevel, numberoflevel };
                });
              }
              return value;
            });
          }
          data.push(subData);
          return dataCurrentWeek;
        });
      }
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getListOKRsCheckin(userId: number, cycleId: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.getListOKRsCheckin(userId, cycleId);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
