import { Injectable, HttpStatus } from '@nestjs/common';

import { CheckinRepository } from './checkin.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';
import { CreateCheckinDTO } from './checkin.dto';
import { EntityManager } from 'typeorm';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class CheckinService {
  constructor(private readonly _checkinRepository: CheckinRepository, private _userRepository: UserRepository) {}

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

  public async createUpdateCheckin(data: CreateCheckinDTO, manager: EntityManager): Promise<ResponseModel> {
    const dataResponse = await this._checkinRepository.createUpdateCheckin(data, manager);
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
}
