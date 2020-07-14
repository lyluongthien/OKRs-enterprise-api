import { Injectable } from '@nestjs/common';

import { KeyResultRepository } from './keyresult.repository';
import { KeyResultDTO } from './keyresult.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';

@Injectable()
export class KeyResultService {
  constructor(private _keyResultRepository: KeyResultRepository) {}

  public createKeyResult(data: KeyResultDTO): Promise<KeyResultEntity> {
    //return this._keyResultRepository.createKeyResult(data);
    return null;
  }
}
