import { Injectable, HttpStatus } from '@nestjs/common';
import { startOfWeek, endOfWeek } from 'date-fns';

import {
  TopStarType,
  CommonMessage,
  OKRsType,
  RoleEnum,
  CheckinStatusType,
  CFRStatusType,
  OKRsStatusType,
  TypeCFRsHistory,
} from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { CFRsRepository } from '../cfrs/cfrs.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { ObjectiveRepository } from '../objective/objective.repository';
import { CheckinRepository } from '../checkin/checkin.repository';
import { CycleRepository } from '../cycle/cycle.repository';

@Injectable()
export class DashboardService {
  constructor(
    private _cfrsRepository: CFRsRepository,
    private _userRepository: UserRepository,
    private _objectiveRepository: ObjectiveRepository,
    private _roleRepository: RoleRepository,
    private _checkinRepository: CheckinRepository,
    private _cycleRepository: CycleRepository,
  ) {}

  public async getTopStars(cycleId: number, type: TopStarType): Promise<ResponseModel> {
    const data = await this._cfrsRepository.getTopStars(cycleId, type);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async viewOKRsProgress(CycleId: number, userId: number): Promise<ResponseModel> {
    const data: any = {};
    const teamLeadId = (await this._userRepository.getTeamLeader(userId)).id;
    const personal = await this._objectiveRepository.getOKRsProgress(CycleId, OKRsType.PERSONAL, userId);
    const team = await this._objectiveRepository.getOKRsProgress(CycleId, OKRsType.TEAM, teamLeadId);
    const root = await this._objectiveRepository.getOKRsProgress(CycleId, OKRsType.ROOT);

    let personalProgress = 0,
      teamProgress = 0,
      rootProgress = 0;
    personal.forEach((value) => {
      personalProgress += value.progress;
    });

    team.forEach((value) => {
      teamProgress += value.progress;
    });

    root.forEach((value) => {
      rootProgress += value.progress;
    });

    data.personal = Math.floor(personalProgress / personal.length);
    data.team = Math.floor(teamProgress / team.length);
    data.root = Math.floor(rootProgress / root.length);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getCFRsStatus(): Promise<ResponseModel> {
    const today = new Date();

    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    const firstday = startOfWeek(today).toISOString();
    const lastday = endOfWeek(today).toISOString();

    const firstDayOfLastWeek = startOfWeek(lastWeek).toISOString();
    const lastDayOfLastWeek = endOfWeek(lastWeek).toISOString();

    const adminRoleId = (await this._roleRepository.getRoleByName(RoleEnum.ADMIN)).id;

    const numberoffeedback = await this._cfrsRepository.getCFRsInWeek(
      firstday,
      lastday,
      firstDayOfLastWeek,
      lastDayOfLastWeek,
      TypeCFRsHistory.FEED_BACK,
    );
    const numberOfRecognition = await this._cfrsRepository.getCFRsInWeek(
      firstday,
      lastday,
      firstDayOfLastWeek,
      lastDayOfLastWeek,
      TypeCFRsHistory.RECOGNITION,
    );
    const numberOfManager = await this._cfrsRepository.getTopManagerUseCFRsInWeek(
      firstday,
      lastday,
      firstDayOfLastWeek,
      lastDayOfLastWeek,
      adminRoleId,
    );
    const feedbackObject = {
      name: CFRStatusType.FEED_BACK,
      value: numberoffeedback[0].numberofcfrs ? numberoffeedback[0].numberofcfrs : 0,
      changing: numberoffeedback[0].changing ? numberoffeedback[0].changing : 0,
    };

    const recongnitionObject = {
      name: CFRStatusType.RECOGNITION,
      value: numberOfRecognition[0].numberofcfrs ? numberOfRecognition[0].numberofcfrs : 0,
      changing: numberOfRecognition[0].changing ? numberOfRecognition[0].changing : 0,
    };

    const managerObject = {
      name: CFRStatusType.MANAGER,
      value: numberOfManager[0].numberofleader ? numberOfManager[0].numberofleader : 0,
      changing: numberOfManager[0].changing ? numberOfManager[0].changing : 0,
    };
    const data = [];
    data.push(feedbackObject);
    data.push(recongnitionObject);
    data.push(managerObject);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getCheckinStatus(): Promise<ResponseModel> {
    const currentCycleId = (await this._cycleRepository.getCurrentCycle(new Date())).id;
    const data = [];
    if (currentCycleId) {
      const inDue = await this._checkinRepository.getIndueCheckin(currentCycleId);
      const overDue = await this._checkinRepository.getOverdueCheckin(currentCycleId);
      const notYet = await this._checkinRepository.getNotYetCheckin(currentCycleId);
      const inDueObject = {
        name: CheckinStatusType.inDue,
        value: +inDue[0].induecheckin,
      };
      const overDueObject = {
        name: CheckinStatusType.overDue,
        value: +overDue[0].overduecheckin,
      };
      const notYetObject = {
        name: CheckinStatusType.notYet,
        value: +notYet[0].notyetcheckin,
      };
      data.push(inDueObject);
      data.push(overDueObject);
      data.push(notYetObject);
    }
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

    const notYetCheckinCurrentWeek = await this._checkinRepository.getNotYetCheckinStatus(today.toISOString());
    const notYetCheckinLastWeek = await this._checkinRepository.getNotYetCheckinStatus(lastDayOfLastWeek);

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
      good: +good,
      normal: +normal,
      bad: +bad,
      very_bad: +very_bad,
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
      good: +good,
      normal: +normal,
      bad: +bad,
      very_bad: +very_bad,
    };

    const dataResponse = [
      {
        name: OKRsStatusType.GOOD,
        value: dataResponseCurrentWeek.good,
        changing: dataResponseCurrentWeek.good - dataResponseLastWeek.good,
      },
      {
        name: OKRsStatusType.NORMAL,
        value: dataResponseCurrentWeek.normal,
        changing: dataResponseCurrentWeek.normal - dataResponseLastWeek.normal,
      },
      {
        name: OKRsStatusType.BAD,
        value: dataResponseCurrentWeek.bad,
        changing: dataResponseCurrentWeek.bad - dataResponseLastWeek.bad,
      },
      {
        name: OKRsStatusType.VERY_BAD,
        value: dataResponseCurrentWeek.very_bad,
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
