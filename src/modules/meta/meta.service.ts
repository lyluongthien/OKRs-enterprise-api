import { Injectable, HttpStatus } from '@nestjs/common';
import { TeamRepository } from '../team/team.repository';
import { JobRepository } from '../job/job.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';

@Injectable()
export class MetaService {
  constructor(
    private readonly _teamRepository: TeamRepository,
    private readonly _jobPositionRepository: JobRepository,
    private readonly _cycleRepository: CycleRepository,
  ) {}

  public async getListTeams(): Promise<ResponseModel> {
    const data = await this._teamRepository.getListTeams();
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
}
