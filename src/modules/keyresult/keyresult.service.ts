import { Injectable } from '@nestjs/common';

import { KeyResultRepository } from './keyresult.repository';
import { KeyResultDTO } from './keyresult.dto';

@Injectable()
export class KeyResultService {
  constructor(private _keyResultRepository: KeyResultRepository) {}

  public createKeyResult(data: KeyResultDTO[]): Promise<void> {
    return this._keyResultRepository.createKeyResult(data);
  }
}
