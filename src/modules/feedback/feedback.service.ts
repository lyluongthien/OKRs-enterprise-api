import { Injectable, HttpStatus } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { ResponseModel } from '@app/constants/app.interface';
import {
  CommonMessage,
  CheckinType,
  TypeCFRsHistory,
  EvaluationCriteriaEnum,
  CFRsHistoryType,
} from '@app/constants/app.enums';
import { CheckinRepository } from '../checkin/checkin.repository';
import { UserRepository } from '../user/user.repository';
import { FeedbackDTO } from './feedback.dto';
import { EntityManager } from 'typeorm';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { UserStarRepository } from '../user-star/user-star.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { RecognitionRepository } from '../recognition/recognition.repository';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

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
  ) {}

  public async listWaitingFeedBack(id: number): Promise<ResponseModel> {
    const data: any = {};
    const user = await this._userRepository.getUserByID(id);
    const isLeader = user.isLeader;
    const admin = await this._userRepository.getAdmin();
    const cycleId = (await this._cycleRepository.getCurrentCycle(new Date())).id;
    if (isLeader && id != admin.id) {
      data.superior = {
        user: {
          id: admin.id,
          fullName: admin.fullName,
          avatarURL: admin.avatarURL ? admin.avatarURL : null,
          gravatarURL: admin.gravatarURL ? admin.gravatarURL : null,
        },
        type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        checkins: await this._checkinRepository.getDoneCheckinById(
          id,
          cycleId,
          CheckinType.PERSONAL,
          EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        ),
      };
      data.inferior = {
        type: EvaluationCriteriaEnum.LEADER_TO_MEMBER,
        checkins: await this._checkinRepository.getDoneCheckinById(
          id,
          cycleId,
          CheckinType.MEMBER,
          EvaluationCriteriaEnum.LEADER_TO_MEMBER,
        ),
      };
    } else if (id == admin.id) {
      data.superior = {
        user: {
          id: admin.id,
          fullName: admin.fullName,
          avatarURL: admin.avatarURL ? admin.avatarURL : null,
          gravatarURL: admin.gravatarURL ? admin.gravatarURL : null,
        },
        type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        checkins: await this._checkinRepository.getDoneCheckinById(
          id,
          cycleId,
          CheckinType.PERSONAL,
          EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        ),
      };
      data.inferior = {
        type: EvaluationCriteriaEnum.LEADER_TO_MEMBER,
        checkins: await this._checkinRepository.getDoneCheckinById(
          id,
          cycleId,
          CheckinType.MEMBER,
          EvaluationCriteriaEnum.LEADER_TO_MEMBER,
        ),
      };
    } else {
      const teamLeader = await this._userRepository.getTeamLeader(id);
      data.superior = {
        user: {
          id: teamLeader.id,
          fullName: teamLeader.fullName,
          avatarURL: teamLeader.avatarURL ? teamLeader.avatarURL : null,
          gravatarURL: teamLeader.gravatarURL ? teamLeader.gravatarURL : null,
        },
        type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        checkins: await this._checkinRepository.getDoneCheckinById(
          id,
          cycleId,
          CheckinType.PERSONAL,
          EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        ),
      };
      data.inferior = {};
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createFeedBack(
    data: FeedbackDTO,
    senderId: number,
    type: EvaluationCriteriaEnum,
    manager: EntityManager,
  ): Promise<ResponseModel> {
    if (data && senderId) {
      await this._feedBackRepository.createFeedBack(data, senderId, manager);
      await this._checkinRepository.updateCheckinStatus(data.checkinId, type, manager);
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

  public async getCFRsHistory(
    userId: number,
    cycleId: number,
    options: IPaginationOptions,
    type: CFRsHistoryType,
  ): Promise<ResponseModel> {
    let data = null;
    if (userId && cycleId && options && type) {
      if (type == CFRsHistoryType.SENT) {
        const sent = await this._feedBackRepository.getSentFeedback(userId, cycleId, options);
        const recognitionSent = await this._recognitionRepository.getSentRecognitions(userId, cycleId, options);
        sent.items.map((value) => {
          value.type = TypeCFRsHistory.FEED_BACK;
          return value;
        });
        recognitionSent.items.map((value) => {
          value.type = TypeCFRsHistory.RECOGNITION;
          sent.items.push(value);
          return value;
        });
        sent.meta.totalItems += recognitionSent.meta.totalItems;
        sent.meta.totalPages = Math.ceil(sent.meta.totalItems / options.limit);
        sent.items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0));
        delete sent.links;
        delete sent.meta.itemCount;
        data = sent;
      } else if (type == CFRsHistoryType.RECEIVED) {
        const received = await this._feedBackRepository.getReceivedFeedback(userId, cycleId, options);
        const recognitionReceived = await this._recognitionRepository.getReceivedRecognitions(userId, cycleId, options);
        received.items.map((value) => {
          value.type = TypeCFRsHistory.FEED_BACK;
          return value;
        });
        recognitionReceived.items.map((value) => {
          value.type = TypeCFRsHistory.RECOGNITION;
          received.items.push(value);
          return value;
        });
        received.meta.totalItems += recognitionReceived.meta.totalItems;
        received.meta.totalPages = Math.ceil(received.meta.totalItems / options.limit);
        received.items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0));
        delete received.links;
        delete received.meta.itemCount;
        data = received;
      } else if (type == CFRsHistoryType.ALL) {
        const all = await this._feedBackRepository.getAllFeedBacks(cycleId, options);
        const recognition = await this._recognitionRepository.getAllRecognitions(cycleId, options);
        all.items.map((value) => {
          value.type = TypeCFRsHistory.FEED_BACK;
          return value;
        });
        recognition.items.map((value) => {
          value.type = TypeCFRsHistory.RECOGNITION;
          all.items.push(value);
          return value;
        });
        all.meta.totalItems += recognition.meta.totalItems;
        all.meta.totalPages = Math.ceil(all.meta.totalItems / options.limit);
        all.items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0));
        delete all.links;
        delete all.meta.itemCount;
        data = all;
      }
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
