import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { async } from 'rxjs';

@Injectable()
export class ObjectiveService {
  constructor(private _objectiveRepository: ObjectiveRepository, private _keyresultRepository: KeyResultRepository) {}

  public async createOKRs(data: OkrsDTO): Promise<OkrsDTO> {
    // const queryRunner = this.connection.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   await queryRunner.manager.save(data.objective);
    //   await queryRunner.manager.save(data.keyResult);
    //   await queryRunner.commitTransaction();
    //   return data;
    // } catch (err) {
    //   console.log(err);
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }

    return null;
  }
}
