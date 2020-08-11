import { Injectable, HttpStatus } from '@nestjs/common';

import { TopStarType, CommonMessage, OKRsType, RoleEnum } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { FeedbackRepository } from '../feedback/feedback.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { ObjectiveRepository } from '../objective/objective.repository';
import { RecognitionRepository } from '../recognition/recognition.repository';

@Injectable()
export class DashboardService {
  constructor(
    private _feedBackRepository: FeedbackRepository,
    private _recognitionRepository: RecognitionRepository,
    private _userRepository: UserRepository,
    private _objectiveRepository: ObjectiveRepository,
    private _roleRepository: RoleRepository,
  ) {}

  public async getTopStars(cycleId: number, type: TopStarType): Promise<ResponseModel> {
    const data = await this._feedBackRepository.getTopStars(cycleId, type);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async viewOKRsProgress(CycleId: number, userId: number): Promise<ResponseModel> {
    const data: any = {};
    const teamLeadId = (await this._userRepository.getTeamLeaderId(userId)).id;
    data.personal = await this._objectiveRepository.getOKRsProgress(CycleId, OKRsType.PERSONAL, userId);
    data.team = await this._objectiveRepository.getOKRsProgress(CycleId, OKRsType.TEAM, teamLeadId);
    data.root = await this._objectiveRepository.getOKRsProgress(CycleId, OKRsType.ROOT);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getFirstAndLastDate(): Promise<ResponseModel> {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const last = first + 6;

    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const firstOfLastWeek = lastWeek.getDate() - lastWeek.getDay() + 1;
    const lastOfLastWeek = firstOfLastWeek + 6;

    const firstday = new Date(today.setDate(first)).toISOString();
    const lastday = new Date(today.setDate(last)).toISOString();

    const firstDayOfLastWeek = new Date(lastWeek.setDate(firstOfLastWeek)).toISOString();
    const lastDayOfLastWeek = new Date(lastWeek.setDate(lastOfLastWeek)).toISOString();

    const adminId = (await this._roleRepository.getRoleByName(RoleEnum.ADMIN)).id;

    const numberoffeedback = await this._feedBackRepository.getFeedBackInWeek(
      firstday,
      lastday,
      firstDayOfLastWeek,
      lastDayOfLastWeek,
    );
    const numberOfRecognition = await this._recognitionRepository.getRecognitionInWeek(
      firstday,
      lastday,
      firstDayOfLastWeek,
      lastDayOfLastWeek,
    );
    const numberOfManager = await this._feedBackRepository.getTopManagerUseCFRsInWeek(
      firstday,
      lastday,
      firstDayOfLastWeek,
      lastDayOfLastWeek,
      adminId,
    );

    const data = { numberoffeedback, numberOfRecognition, numberOfManager };

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
