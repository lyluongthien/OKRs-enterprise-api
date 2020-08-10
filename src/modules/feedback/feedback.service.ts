import { Injectable, HttpStatus } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, CheckinType, CheckinStatus } from '@app/constants/app.enums';
import { CheckinRepository } from '../checkin/checkin.repository';
import { UserRepository } from '../user/user.repository';
import { FeedbackDTO } from './feedback.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    private _feedBackRepository: FeedbackRepository,
    private _checkinRepository: CheckinRepository,
    private _userRepository: UserRepository,
  ) {}

  public async ListWaitingFeedBack(id: number): Promise<ResponseModel> {
    const data: any = {};
    const isLeader = (await this._userRepository.getUserByID(id)).isLeader;
    const adminId = (await this._userRepository.getAdmin()).id;
    if (isLeader || id == adminId) {
      data.team = await this._checkinRepository.getDoneCheckinById(id, CheckinType.TEAM_LEADER);
      data.personal = await this._checkinRepository.getDoneCheckinById(id, CheckinType.MEMBER);
    } else {
      data.personal = await this._checkinRepository.getDoneCheckinById(id, CheckinType.MEMBER);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createFeedBack(data: FeedbackDTO, senderId: number, manager: EntityManager): Promise<ResponseModel> {
    await this._feedBackRepository.createFeedBack(data, senderId, manager);
    await this._checkinRepository.updateCheckinStatus(data.checkinId, CheckinStatus.CLOSED, manager);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }
}
