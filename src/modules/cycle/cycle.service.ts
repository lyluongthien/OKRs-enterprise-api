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

  public async createCycle(cycleDTO: CycleDTO): Promise<ResponseModel> {
    const data = await this._cycleRepository.createCycle(cycleDTO);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: data,
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

  public async updateCycle(id: number, cycleDTO: Partial<CycleDTO>): Promise<ResponseModel> {
    const data = await this._cycleRepository.updateCycle(id, cycleDTO);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
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
