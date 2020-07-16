import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';
import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ObjectiveService {
  constructor(private _objectiveRepository: ObjectiveRepository, private _keyresultRepository: KeyResultRepository) {}

  public async createOKRs(okrDTo: OkrsDTO, manager?: EntityManager): Promise<void> {
    const objective = await manager.getRepository(ObjectiveEntity).save(okrDTo.objective);
    const KeyResultRepository = manager.getRepository(KeyResultEntity);

    for (const value of okrDTo.keyResult) {
      value.objectiveId = objective.id;
      await KeyResultRepository.save(value);
    }
  }

  public async viewOKRs(options: IPaginationOptions, cycleID: number): Promise<Pagination<ObjectiveEntity>> {
    return await this._objectiveRepository.viewOKRs(options, cycleID);
  }

  public async getDetailOKRs(id: number): Promise<ObjectiveEntity> {
    return await this._objectiveRepository.getDetailOKRs(id);
  }
}
