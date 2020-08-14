import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { KeyResultRepository } from './keyresult.repository';
import { KeyResultDTO } from './keyresult.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';
import { ObjectiveRepository } from '../objective/objective.repository';
import { KEY_RESULT, KEY_RESULT_INVALID } from '@app/constants/app.exeption';

@Injectable()
export class KeyResultService {
  constructor(private _keyResultRepository: KeyResultRepository, private _objectiveRepository: ObjectiveRepository) {}

  public async createAndUpdateKeyResult(data: KeyResultDTO[]): Promise<ResponseModel> {
    await this._keyResultRepository.createAndUpdateKeyResult(data);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }

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
        throw new HttpException(KEY_RESULT.message, KEY_RESULT.statusCode);
      }
      data = await this._keyResultRepository.deleteKeyResults(keyResultId);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async updateKeyresults(id: number, data: KeyResultDTO): Promise<ResponseModel> {
    await this._keyResultRepository.updateKeyResults(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }
}
