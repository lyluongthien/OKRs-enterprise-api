import { KeyResultDTO } from './keyresult.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';

import { Repository, EntityRepository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(KeyResultEntity)
export class KeyResultRepository extends Repository<KeyResultEntity> {
  public async createKeyResult(data: KeyResultDTO[]): Promise<void> {
    try {
      this.save(data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
