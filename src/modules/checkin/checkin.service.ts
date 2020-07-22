import { Injectable, HttpStatus } from '@nestjs/common';

import { CheckinRepository } from './checkin.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';
import { CreateCheckinDTO } from './checkin.dto';
import { ObjectiveRepository } from '../objective/objective.repository';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { EntityManager } from 'typeorm';
import { check } from 'prettier';

@Injectable()
export class CheckinService {
  constructor(
    private readonly _checkinRepository: CheckinRepository,
    private readonly _keyResultRepository: KeyResultRepository,
    private readonly _objectiveRepository: ObjectiveRepository,
  ) {}

  public async getCheckinDetail(checkinId: number): Promise<ResponseModel> {
    const checkin = await this._checkinRepository.getCheckinById(checkinId);
    // const checkinKRs = await this._keyResultRepository.getCheckinKeyResult(objectiveId);

    // checkinKRs.map((checkinKRs) => {
    //   checkinKRs.checkins.map((data) => {
    //     return data.toJSON();
    //   });
    // });

    // const objectiveRes = {
    //   id: objectvie.id,
    //   name: objectvie.title,
    //   progress: objectvie.progress,
    // };
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: checkin,
    };
  }

  public async createUpdateCheckin(data: CreateCheckinDTO, manager: EntityManager): Promise<ResponseModel> {
    const dataResponse = await this._checkinRepository.createUpdateCheckin(data, manager);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }
}
