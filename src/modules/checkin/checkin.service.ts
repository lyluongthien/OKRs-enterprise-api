import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { CheckinRepository } from './checkin.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, ConfidentLevel, CheckinStatus, CheckinStatusLogic } from '@app/constants/app.enums';
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
    checkinId?: number,
  ): Promise<ResponseModel> {
    if (!isNotEmptyObject(data) || !data) {
      throw new HttpException(CommonMessage.BODY_EMPTY, HttpStatus.PAYMENT_REQUIRED);
    }
    if (checkinId) {
      data.checkin.id = checkinId;
    }

    // Calculate progress checkin
    let progressOKR = 0;
    let totalTarget = 0;
    let totalObtained = 0;
    data.checkinDetails.map((value) => {
      totalTarget += value.targetValue;
      totalObtained += value.valueObtained;
    });
    progressOKR = Math.round(100 * (totalObtained / totalTarget));
    console.log(progressOKR);

    // If staff draft checkin => Do not apdate progress
    if (data.checkin.status !== CheckinStatus.DRAFT) {
      data.checkin.progress = progressOKR;
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

    // If staff checkin done => Update ValueObtained in KeyResult, progress in Objective, Checkin
    if (data.checkin.status !== CheckinStatus.DRAFT) {
      // Update ValueObtained in KeyResult
      await this._keyResultRepository.createAndUpdateKeyResult(keyResultValue, manager);

      // Update progress in Objective
      await this._objectiveRepository.updateProgressOKRs(data.checkin.objectiveId, progressOKR, manager);
    }
    const dataResponse = {
      checkin: checkinModel,
      checkin_details: checkinDetailModel,
    };

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

    const responseData = [];

    data.map((item) => {
      const itemModel = {
        id: 0,
        progress: 0,
        title: '',
        change: 0,
        keyResults: [],
        status: '',
        checkinId: null,
      };
      itemModel.id = item.id;
      itemModel.title = item.title;
      itemModel.progress = item.progress;
      itemModel.keyResults = item.keyResults;

      const checkin = item.checkins[0];
      const preCheckin = item.checkins[1];
      // Calculate changing
      if (checkin && preCheckin && checkin.progress !== 0) {
        itemModel.change = checkin.progress - preCheckin.progress;
      }
      if (checkin && !preCheckin && checkin.progress !== 0) {
        itemModel.change = checkin.progress;
      }

      // Set status
      if (!checkin) {
        itemModel.status = CheckinStatusLogic.DONE;
      } else {
        // Checkin  is drafted
        if (checkin.status === CheckinStatus.DRAFT) {
          itemModel.status = CheckinStatusLogic.DRAFT;
          itemModel.checkinId = checkin.id;
        }
        // Checkin  is pendding
        if (checkin.status === CheckinStatus.PENDING) {
          itemModel.status = CheckinStatusLogic.PENDING;
          itemModel.checkinId = checkin.id;
        }
        // Checkin  is Done
        if (checkin.status === CheckinStatus.DONE) {
          itemModel.status = CheckinStatusLogic.DONE;
          // Check overdue
          if (checkin.nextCheckinDate) {
            const now = new Date().getTime();
            const nextCheckin = checkin.nextCheckinDate.getTime();
            if (nextCheckin - now < 0) {
              itemModel.status = CheckinStatusLogic.OVERDUE;
            }
          }
        }
      }

      responseData.push(itemModel);
    });

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: responseData,
    };
  }
}
