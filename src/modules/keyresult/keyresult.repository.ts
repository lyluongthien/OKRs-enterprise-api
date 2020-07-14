import { KeyResultDTO } from './keyresult.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';

import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(KeyResultEntity)
export class KeyResultRepository extends Repository<KeyResultEntity> {
  public async createKeyResult(data: KeyResultDTO): Promise<KeyResultEntity> {
    return await this.save(data);
  }
}
