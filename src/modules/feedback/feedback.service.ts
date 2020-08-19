import { Injectable, HttpStatus } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { ResponseModel } from '@app/constants/app.interface';
import {
  CommonMessage,
  CheckinType,
  CheckinStatus,
  TypeCFRsHistory,
  EvaluationCriteriaEnum,
} from '@app/constants/app.enums';
import { CheckinRepository } from '../checkin/checkin.repository';
import { UserRepository } from '../user/user.repository';
import { FeedbackDTO } from './feedback.dto';
import { EntityManager } from 'typeorm';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { UserStarRepository } from '../user-star/user-star.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { TeamRepository } from '../team/team.repository';
import { RecognitionRepository } from '../recognition/recognition.repository';

@Injectable()
export class FeedbackService {
  constructor(
    private _feedBackRepository: FeedbackRepository,
    private _recognitionRepository: RecognitionRepository,
    private _checkinRepository: CheckinRepository,
    private _userRepository: UserRepository,
    private _evaluationCriteriaRepository: EvaluationCriteriaRepository,
    private _userStarsRepository: UserStarRepository,
    private _cycleRepository: CycleRepository,
    private _teamRepository: TeamRepository,
  ) {}

  public async listWaitingFeedBack(id: number): Promise<ResponseModel> {
    const data: any = {};
    const user = await this._userRepository.getUserByID(id);
    const isLeader = user.isLeader;
    const admin = await this._userRepository.getAdmin();
    const cycleId = (await this._cycleRepository.getCurrentCycle(new Date())).id;
    if (isLeader) {
      data.superior = {
        teamLead: admin.fullName,
        avatar: admin.avatar,
        gravatar: admin.gravatarURL,
        type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        checkins: await this._checkinRepository.getDoneCheckinById(id, cycleId, CheckinType.PERSONAL),
      };

      data.inferior = {
        type: EvaluationCriteriaEnum.LEADER_TO_MEMBER,
        checkins: await this._checkinRepository.getDoneCheckinById(id, cycleId, CheckinType.MEMBER),
      };
    } else if (id == admin.id) {
      data.superior = {
        type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        checkins: await this._checkinRepository.getDoneCheckinById(id, cycleId, CheckinType.PERSONAL),
      };
      data.inferior = {
        type: EvaluationCriteriaEnum.LEADER_TO_MEMBER,
        checkins: await this._checkinRepository.getDoneCheckinById(id, cycleId, CheckinType.MEMBER),
      };
    } else {
      const teamLeader = await this._userRepository.getTeamLeader(id);
      data.superior = {
        teamLead: teamLeader.fullName,
        avatar: teamLeader.avatar,
        gravatar: teamLeader.gravatarURL,
        type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        checkins: await this._checkinRepository.getDoneCheckinById(id, cycleId, CheckinType.PERSONAL),
      };
      data.inferior = {};
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

  public async getCFRsHistory(userId: number, cycleId: number): Promise<ResponseModel> {
    const data: any = {};
    if (userId && cycleId) {
      data.sent = await this._feedBackRepository.getSentFeedback(userId, cycleId);
      data.received = await this._feedBackRepository.getReceivedFeedback(userId, cycleId);
      const cfrs = await this._feedBackRepository.getAllFeedBacks(cycleId);
      cfrs.map((value) => {
        value.type = TypeCFRsHistory.FEED_BACK;
        return value;
      });
      const recognition = await this._recognitionRepository.getAllRecognitions(cycleId);
      recognition.map((value) => {
        value.type = TypeCFRsHistory.RECOGNITION;
        cfrs.push(value);
        return value;
      });
      cfrs.sort((a, b) => (a.createdAt > b.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0));
      data.CFRs = cfrs;
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getDetailFeedback(feedbackId: number): Promise<ResponseModel> {
    const data = await this._feedBackRepository.getDetailFeedback(feedbackId);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
