import { Injectable, HttpStatus } from '@nestjs/common';
import { TeamRepository } from '../team/team.repository';
import { JobRepository } from '../job/job.repository';
import { CommonMessage, EvaluationCriteriaEnum } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { LessonRepository } from '../lesson/lesson.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class MetaService {
  constructor(
    private readonly _teamRepository: TeamRepository,
    private readonly _jobPositionRepository: JobRepository,
    private readonly _lessonRepository: LessonRepository,
    private readonly _cycleRepository: CycleRepository,
    private readonly _evaluationCriteriaRepository: EvaluationCriteriaRepository,
    private readonly _roleRepository: RoleRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async getListTeams(): Promise<ResponseModel> {
    const adminTeamId = (await this._userRepository.getAdmin()).teamId;
    const data = await this._teamRepository.getListTeams(adminTeamId);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getListJob(): Promise<ResponseModel> {
    const data = await this._jobPositionRepository.getListJob();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getLengthLesson(): Promise<ResponseModel> {
    const data = await this._lessonRepository.getLengthLesson();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {
        length: data,
      },
    };
  }
  public async getCycles(): Promise<ResponseModel> {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const date = year + '-' + month + '-' + day;
    const data = {
      current: await this._cycleRepository.getCurrentCycle(date),
      all: await this._cycleRepository.getList(),
    };
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getEvaluationCriterias(type: EvaluationCriteriaEnum): Promise<ResponseModel> {
    const data = await this._evaluationCriteriaRepository.getList(type);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getRoles(): Promise<ResponseModel> {
    const data = await this._roleRepository.getListRoles();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
