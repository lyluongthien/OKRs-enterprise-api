import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { KeyResultRepository } from './keyresult.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, DeleteKeyresultType } from '@app/constants/app.enums';
import { KEY_RESULT_INVALID, DELETE_KEY_RESULT } from '@app/constants/app.exeption';

@Injectable()
export class KeyResultService {
  constructor(private _keyResultRepository: KeyResultRepository) {}

  public async deleteKeyResult(keyResultId: number, userId: number): Promise<ResponseModel> {
    let data = null;
    if (keyResultId && userId) {
      const keyResultIds = await this._keyResultRepository.getListKeyresultIds();
      const keyResultExist = keyResultIds.some(({ id }) => id === keyResultId);
      if (!keyResultExist) {
        throw new HttpException(KEY_RESULT_INVALID.message, KEY_RESULT_INVALID.statusCode);
      }
      const keyResultValidIds = await this._keyResultRepository.getKeyResultsByUserId(userId);
      const keyresultValid = keyResultValidIds.some(({ id }) => id === keyResultId);
      if (!keyresultValid) {
        throw new HttpException(DELETE_KEY_RESULT.message, DELETE_KEY_RESULT.statusCode);
      }
      data = await this._keyResultRepository.deleteKeyResults(keyResultId, DeleteKeyresultType.KEY_RESULT);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
