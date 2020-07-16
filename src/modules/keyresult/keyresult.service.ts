import { Injectable, HttpStatus } from '@nestjs/common';

import { KeyResultRepository } from './keyresult.repository';
import { KeyResultDTO } from './keyresult.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class KeyResultService {
  constructor(private _keyResultRepository: KeyResultRepository) {}

  public async createKeyResult(data: KeyResultDTO[]): Promise<ResponseModel> {
    await this._keyResultRepository.createKeyResult(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.VALID_TOKEN,
      data: {},
    };
  }
}
