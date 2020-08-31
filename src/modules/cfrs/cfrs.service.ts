import { Injectable, HttpStatus } from '@nestjs/common';
import { CFRsRepository } from './cfrs.repository';
import { ResponseModel } from '@app/constants/app.interface';
import {
  CommonMessage,
  CheckinType,
  EvaluationCriteriaEnum,
  CFRsHistoryType,
  TypeCFRsHistory,
} from '@app/constants/app.enums';
import { CheckinRepository } from '../checkin/checkin.repository';
import { UserRepository } from '../user/user.repository';
import { CFRsDTO } from './cfrs.dto';
import { EntityManager } from 'typeorm';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { UserStarRepository } from '../user-star/user-star.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class CFRsService {
  constructor(
    private _cfrsRepository: CFRsRepository,
    private _checkinRepository: CheckinRepository,
    private _userRepository: UserRepository,
    private _evaluationCriteriaRepository: EvaluationCriteriaRepository,
    private _userStarsRepository: UserStarRepository,
    private _cycleRepository: CycleRepository,
  ) {}

  public async listWaitingFeedBack(id: number, options: IPaginationOptions): Promise<ResponseModel> {
    const data: any = {};
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const date = year + '-' + month + '-' + day;
    const user = await this._userRepository.getUserByID(id);
    const isLeader = user.isLeader;
    const admin = await this._userRepository.getAdmin();
    const cycleId = (await this._cycleRepository.getCurrentCycle(date)).id;
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
          options,
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
          options,
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

  public async createCFRs(
    data: CFRsDTO,
    senderId: number,
    type: EvaluationCriteriaEnum,
    manager: EntityManager,
  ): Promise<ResponseModel> {
    if (data && senderId) {
      data.senderId = senderId;
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const date = year + '-' + month + '-' + day;
      const cycleId = (await this._cycleRepository.getCurrentCycle(date)).id;
      data.cycleId = cycleId;
      await this._cfrsRepository.createCFRs(data, manager);
      if (data.checkinId && data.type == TypeCFRsHistory.FEED_BACK)
        await this._checkinRepository.updateCheckinStatus(data.checkinId, type, manager);
      const userStar = {
        star: (await this._evaluationCriteriaRepository.getCriteriaDetail(data.evaluationCriteriaId)).numberOfStar,
        cycleId: cycleId,
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
    if (cycleId && options && type) {
      if (userId) {
        if (type == CFRsHistoryType.SENT) {
          data = await this._cfrsRepository.getSentCFRs(userId, cycleId, options);
        } else if (type == CFRsHistoryType.RECEIVED) {
          data = await this._cfrsRepository.getReceivedCFRs(userId, cycleId, options);
        }
      }
      if (type == CFRsHistoryType.ALL) {
        data = await this._cfrsRepository.getAllCFRs(cycleId, options);
        //data.items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0));
      }
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getDetailCFRs(cfrsId: number): Promise<ResponseModel> {
    const data = await this._cfrsRepository.getDetailCFRs(cfrsId);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
