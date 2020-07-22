import { Injectable, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveRepository } from './objective.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class ObjectiveService {
  constructor(private _objectiveRepository: ObjectiveRepository) {}

  public async createAndUpdateOKRs(okrDTo: OkrsDTO, manager: EntityManager, userID: number): Promise<ResponseModel> {
    await this._objectiveRepository.createAndUpdateOKRs(okrDTo, manager, userID);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }

  public async viewOKRs(cycleID: number, text: string): Promise<ResponseModel> {
    const data = await this._objectiveRepository.viewOKRs(cycleID, text);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getDetailOKRs(id: number): Promise<ResponseModel> {
    const data = await this._objectiveRepository.getDetailOKRs(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
  public async deleteOKRs(id: number): Promise<ResponseModel> {
    const rowEffected: string = (await this._objectiveRepository.deleteOKRs(id)).toString();
    if (rowEffected === '1')
      return {
        statusCode: HttpStatus.OK,
        message: CommonMessage.SUCCESS,
        data: { isDeleted: true },
      };
    return { statusCode: HttpStatus.OK, message: CommonMessage.DELETE_FAIL, data: { isDeleted: false } };
  }
}
