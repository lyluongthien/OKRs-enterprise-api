import { Injectable, HttpStatus } from '@nestjs/common';

import { KeyResultRepository } from './keyresult.repository';
import { KeyResultDTO } from './keyresult.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class KeyResultService {
  constructor(private _keyResultRepository: KeyResultRepository) {}

  public async createAndUpdateKeyResult(data: KeyResultDTO[]): Promise<ResponseModel> {
    await this._keyResultRepository.createAndUpdateKeyResult(data);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }

  public async deleteKeyResult(id: number): Promise<ResponseModel> {
    const rowEffected: string = (await this._keyResultRepository.deleteKeyResults(id)).toString();
    if (rowEffected === '1')
      return {
        statusCode: HttpStatus.OK,
        message: CommonMessage.SUCCESS,
        data: { isDeleted: true },
      };
    return { statusCode: HttpStatus.OK, message: CommonMessage.DELETE_FAIL, data: { isDeleted: false } };
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
