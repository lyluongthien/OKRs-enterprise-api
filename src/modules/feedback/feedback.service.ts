import { Injectable, HttpStatus } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, CheckinType } from '@app/constants/app.enums';
import { CheckinRepository } from '../checkin/checkin.repository';
import { UserEntity } from '@app/db/entities/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class FeedbackService {
  constructor(
    private _feedBackRepository: FeedbackRepository,
    private _checkinRepository: CheckinRepository,
    private _userRepository: UserRepository,
  ) {}

  public async viewListCFRs(me: UserEntity): Promise<ResponseModel> {
    const data: any = {};
    const isLeader = (await this._userRepository.getUserByID(me.id)).isLeader;
    if (isLeader) {
      data.team = await this._checkinRepository.getDoneCheckinById(me.id, CheckinType.TEAM_LEADER);
      data.personal = await this._checkinRepository.getDoneCheckinById(me.id, CheckinType.MEMBER);
    } else {
      data.personal = await this._checkinRepository.getDoneCheckinById(me.id, CheckinType.MEMBER);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
