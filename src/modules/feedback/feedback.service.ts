import { Injectable, HttpStatus } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, CheckinType, CheckinStatus } from '@app/constants/app.enums';
import { CheckinRepository } from '../checkin/checkin.repository';
import { UserRepository } from '../user/user.repository';
import { FeedbackDTO } from './feedback.dto';
import { EntityManager } from 'typeorm';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { UserStarRepository } from '../user-star/user-star.repository';
import { CycleRepository } from '../cycle/cycle.repository';

@Injectable()
export class FeedbackService {
  constructor(
    private _feedBackRepository: FeedbackRepository,
    private _checkinRepository: CheckinRepository,
    private _userRepository: UserRepository,
    private _evaluationCriteriaRepository: EvaluationCriteriaRepository,
    private _userStarsRepository: UserStarRepository,
    private _cycleRepository: CycleRepository,
  ) {}

  public async listWaitingFeedBack(id: number): Promise<ResponseModel> {
    const data: any = {};
    const user = await this._userRepository.getUserByID(id);
    const isLeader = user.isLeader;
    const adminId = (await this._userRepository.getAdmin()).id;
    if (isLeader) {
      data.team = await this._checkinRepository.getDoneCheckinById(adminId, CheckinType.TEAM_LEADER);
      data.member = await this._checkinRepository.getDoneCheckinById(id, CheckinType.MEMBER);
    } else if (id == adminId) {
      data.personal = await this._checkinRepository.getDoneCheckinById(id, CheckinType.PERSONAL);
      data.member = await this._checkinRepository.getDoneCheckinById(id, CheckinType.MEMBER);
    } else {
      const teamLeaderId = (await this._userRepository.getTeamLeaderId(id)).id;
      data.team = data.team = await this._checkinRepository.getDoneCheckinById(teamLeaderId, CheckinType.TEAM_LEADER);
      data.member = [];
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createFeedBack(data: FeedbackDTO, senderId: number, manager: EntityManager): Promise<ResponseModel> {
    if (data && senderId) {
      await this._feedBackRepository.createFeedBack(data, senderId, manager);
      await this._checkinRepository.updateCheckinStatus(data.checkinId, CheckinStatus.CLOSED, manager);
      const userStar = {
        star: (await this._evaluationCriteriaRepository.getCriteriaDetail(data.evaluationCriteriaId)).numberOfStar,
        cycleId: (await this._cycleRepository.getCurrentCycle(new Date())).id,
        userId: data.receiverId,
      };
      await this._userStarsRepository.createUserStar(userStar, manager);
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }
}
