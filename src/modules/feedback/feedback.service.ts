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
import { ObjectiveRepository } from '../objective/objective.repository';

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
    private _objectiveRepository: ObjectiveRepository,
  ) {}

  public async listWaitingFeedBack(id: number): Promise<ResponseModel> {
    const data: any = {};
    const user = await this._userRepository.getUserByID(id);
    const isLeader = user.isLeader;
    const adminId = (await this._userRepository.getAdmin()).id;
    const cycleId = (await this._cycleRepository.getCurrentCycle(new Date())).id;
    if (isLeader) {
      const teamName = (await this._teamRepository.getDetailTeam(user.teamId)).name;
      data.list2 = {
        name: (await this._userRepository.getAdmin()).fullName,
        list: await this._checkinRepository.getDoneCheckinById(adminId, cycleId, CheckinType.TEAM_LEADER),
      };
      data.list1 = {
        name: teamName,
        list: await this._checkinRepository.getDoneCheckinById(id, cycleId, CheckinType.MEMBER),
      };
    } else if (id == adminId) {
      data.list2 = {
        name: user.fullName,
        list: await this._checkinRepository.getDoneCheckinById(id, cycleId, CheckinType.PERSONAL),
      };
      data.list1 = {
        name: 'Team Của Bạn',
        list: await this._checkinRepository.getDoneCheckinById(id, cycleId, CheckinType.MEMBER),
      };
    } else {
      const teamLeaderId = (await this._userRepository.getTeamLeaderId(id)).id;
      const teamName = (await this._teamRepository.getDetailTeam(user.teamId)).name;
      data.list2 = {
        name: teamName,
        list: await this._checkinRepository.getDoneCheckinById(teamLeaderId, cycleId, CheckinType.TEAM_LEADER),
      };
      data.list1 = [];
    }

    if (data.list1.list && data.list1.list.length > 0) {
      data.list1.list.map((value) => {
        value.type = EvaluationCriteriaEnum.LEADER_TO_MEMBER;
        return value;
      });
    }
    if (data.list2.list && data.list2.list.length > 0) {
      data.list2.list.map((value) => {
        value.type = EvaluationCriteriaEnum.MEMBER_TO_LEADER;
        return value;
      });
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async listWaitting(userId: number): Promise<ResponseModel> {
    // const user = await this._userRepository.getUserByID(userId);
    const objective = await this._objectiveRepository.getObjectiveFeedback(userId);

    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: objective,
    };
  }

  public async searchListWaitingFeedBack(text: string, userId: number): Promise<ResponseModel> {
    const user = await this._userRepository.getUserByID(userId);
    const isLeader = user.isLeader;
    const adminId = (await this._userRepository.getAdmin()).id;
    const cycleId = (await this._cycleRepository.getCurrentCycle(new Date())).id;
    let data = null;
    if (isLeader) {
      data = await this._checkinRepository.searchDoneCheckin(text, adminId, cycleId, CheckinType.TEAM_LEADER);
    } else if (userId == adminId) {
      data = await this._checkinRepository.searchDoneCheckin(text, userId, cycleId, CheckinType.MEMBER);
    } else {
      const teamLeaderId = (await this._userRepository.getTeamLeaderId(userId)).id;
      data = await this._checkinRepository.searchDoneCheckin(text, teamLeaderId, cycleId, CheckinType.TEAM_LEADER);
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
