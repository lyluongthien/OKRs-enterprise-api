import { Injectable, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';
import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class ObjectiveService {
  constructor(private _objectiveRepository: ObjectiveRepository, private _keyresultRepository: KeyResultRepository) {}

  public async createOKRs(okrDTo: OkrsDTO, manager?: EntityManager): Promise<ResponseModel> {
    const objective = await manager.getRepository(ObjectiveEntity).save(okrDTo.objective);
    const KeyResultRepository = manager.getRepository(KeyResultEntity);

    for (const value of okrDTo.keyResult) {
      value.objectiveId = objective.id;
      await KeyResultRepository.save(value);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.VALID_TOKEN,
      data: {},
    };
  }

  public async viewOKRs(cycleID: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.viewOKRs(cycleID);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.VALID_TOKEN,
      data: { data },
    };
  }

  public async getDetailOKRs(id: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.getDetailOKRs(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.VALID_TOKEN,
      data: { data },
    };
  }
}
