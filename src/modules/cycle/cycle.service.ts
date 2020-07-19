import { Injectable, HttpStatus } from '@nestjs/common';

import { CycleRepository } from './cycle.repository';
import { CycleDTO } from './cycle.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class CycleService {
  constructor(private _cycleRepository: CycleRepository) {}

  public async getListCycle(): Promise<ResponseModel> {
    const data = await this._cycleRepository.getList();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createCycle(data: CycleDTO): Promise<ResponseModel> {
    const datas = await this._cycleRepository.createCycle(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: datas,
    };
  }

  public async getCycleDetail(id: number): Promise<ResponseModel> {
    const data = await this._cycleRepository.getCycleDetail(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async updateCycle(id: number, data: Partial<CycleDTO>): Promise<ResponseModel> {
    const datas = await this._cycleRepository.updateCycle(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: datas,
    };
  }

  public async deleteCycle(id: number): Promise<ResponseModel> {
    const data = await this._cycleRepository.deleteCycle(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
