import { Injectable, HttpStatus } from '@nestjs/common';

import { TopStarType, CommonMessage, OKRsType } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { FeedbackRepository } from '../feedback/feedback.repository';
import { UserRepository } from '../user/user.repository';
import { ObjectiveRepository } from '../objective/objective.repository';

@Injectable()
export class DashboardService {
  constructor(
    private _feedBackRepository: FeedbackRepository,
    private _userRepository: UserRepository,
    private _objectiveRepository: ObjectiveRepository,
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
}
