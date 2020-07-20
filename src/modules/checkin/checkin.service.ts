import { Injectable, HttpStatus } from '@nestjs/common';

import { CheckinRepository } from './checkin.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';
import { CreateCheckinDTO } from './checkin.dto';
import { ObjectiveRepository } from '../objective/objective.repository';
import { KeyResultRepository } from '../keyresult/keyresult.repository';

@Injectable()
export class CheckinService {
  constructor(
    private readonly _checkinRepository: CheckinRepository,
    private readonly _keyResultRepository: KeyResultRepository,
    private readonly _objectiveRepository: ObjectiveRepository,
  ) {}

  public async getCheckinDetail(objectiveId: number): Promise<ResponseModel> {
    const objectvie = await this._objectiveRepository.getDetailOKRs(objectiveId);
    const checkinKRs = await this._keyResultRepository.getCheckinKeyResult(objectiveId);

    const objectiveRes = {
      id: objectvie.id,
      name: objectvie.title,
      progress: objectvie.progress,
    };
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {
        objective: objectiveRes,
        key_results: checkinKRs,
      },
    };
  }

  public async createCheckin(data: CreateCheckinDTO[]): Promise<ResponseModel> {
    const dataResponse = await this._checkinRepository.createCheckin(data);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }
}
