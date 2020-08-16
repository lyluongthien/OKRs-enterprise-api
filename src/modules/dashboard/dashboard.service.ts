import { Injectable, HttpStatus } from '@nestjs/common';
import { startOfWeek, endOfWeek } from 'date-fns';

import { TopStarType, CommonMessage, OKRsType, RoleEnum } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { FeedbackRepository } from '../feedback/feedback.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { ObjectiveRepository } from '../objective/objective.repository';
import { RecognitionRepository } from '../recognition/recognition.repository';
import { CheckinRepository } from '../checkin/checkin.repository';

@Injectable()
export class DashboardService {
  constructor(
    private _feedBackRepository: FeedbackRepository,
    private _recognitionRepository: RecognitionRepository,
    private _userRepository: UserRepository,
    private _objectiveRepository: ObjectiveRepository,
    private _roleRepository: RoleRepository,
    private _checkinRepository: CheckinRepository,
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

  public async getCFRsStatus(): Promise<ResponseModel> {
    const today = new Date();
    const first = today.getDate() - today.getDay();
    const last = first + 6;

    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const firstOfLastWeek = lastWeek.getDate() - lastWeek.getDay();
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

  public async getOKRsStatus(): Promise<ResponseModel> {
    const today = new Date();

    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    const firstday = startOfWeek(today).toISOString();
    const lastday = endOfWeek(today).toISOString();

    const firstDayOfLastWeek = startOfWeek(lastWeek).toISOString();
    const lastDayOfLastWeek = endOfWeek(lastWeek).toISOString();

    const dataCurrentWeek = await this._checkinRepository.getOKRStatus(firstday, lastday);
    const dataLastWeek = await this._checkinRepository.getOKRStatus(firstDayOfLastWeek, lastDayOfLastWeek);

    const notYetCheckinCurrentWeek = await this._checkinRepository.getNotYetCheckinStatus(firstday, lastday);
    const notYetCheckinLastWeek = await this._checkinRepository.getNotYetCheckinStatus(
      firstDayOfLastWeek,
      lastDayOfLastWeek,
    );

    const start = startOfWeek(new Date()).toISOString();
    const end = endOfWeek(new Date()).toISOString();
    console.log(start + '                ' + end);
    let good = 0,
      normal = 0,
      bad = 0,
      very_bad = 0;

    notYetCheckinCurrentWeek.map((value) => {
      very_bad += value.notyetcheckin;
      return value;
    });
    dataCurrentWeek.map((value) => {
      if (value.progresschanging === 0) very_bad++;
      else {
        if (value.confidentLevel === 1) bad++;
        else if (value.confidentLevel === 2) normal++;
        else if (value.confidentLevel === 3) good++;
      }
      return value;
    });
    const dataResponseCurrentWeek = {
      good: good,
      normal: normal,
      bad: bad,
      very_bad: very_bad,
    };

    good = normal = bad = very_bad = 0;

    notYetCheckinLastWeek.map((value) => {
      very_bad += value.notyetcheckin;
      return value;
    });
    dataLastWeek.map((value) => {
      if (value.progresschanging === 0) very_bad++;
      else {
        if (value.confidentLevel === 1) bad++;
        else if (value.confidentLevel === 2) normal++;
        else if (value.confidentLevel === 3) good++;
      }
    });

    const dataResponseLastWeek = {
      good: good,
      normal: normal,
      bad: bad,
      very_bad: very_bad,
    };

    const dataResponse = [
      {
        good: dataResponseCurrentWeek.good,
        changing: dataResponseCurrentWeek.good - dataResponseLastWeek.good,
      },
      {
        normal: dataResponseCurrentWeek.normal,
        changing: dataResponseCurrentWeek.normal - dataResponseLastWeek.normal,
      },
      {
        bad: dataResponseCurrentWeek.bad,
        changing: dataResponseCurrentWeek.bad - dataResponseLastWeek.bad,
      },
      {
        very_bad: dataResponseCurrentWeek.very_bad,
        changing: dataResponseCurrentWeek.very_bad - dataResponseLastWeek.very_bad,
      },
    ];

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }
}
