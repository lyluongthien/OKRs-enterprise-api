import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { CycleRepository } from './cycle.repository';
import { CycleDTO, updateCycleDTO } from './cycle.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, CycleStatus } from '@app/constants/app.enums';

@Injectable()
export class CycleService {
  constructor(private _cycleRepository: CycleRepository) {}

  public async getCycle(status: string): Promise<ResponseModel> {
    let data = null;
    if (status && status == CycleStatus.CURRENT) {
      const currentDate = new Date();
      data = await this._cycleRepository.getCurrentCycle(currentDate);
    } else {
      data = await this._cycleRepository.getList();
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createCycle(cycleDTO: CycleDTO): Promise<ResponseModel> {
    const startDate = new Date(cycleDTO.startDate).getTime();
    const endDate = new Date(cycleDTO.endDate).getTime();

    if (startDate >= endDate) {
      throw new HttpException(CommonMessage.CYCLE_DATE, HttpStatus.BAD_REQUEST);
    }
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

  public async updateCycle(id: number, cycleDTO: updateCycleDTO): Promise<ResponseModel> {
    const startDate = new Date(cycleDTO.startDate).getTime();
    const endDate = new Date(cycleDTO.endDate).getTime();

    if (startDate >= endDate) {
      throw new HttpException(CommonMessage.CYCLE_DATE, HttpStatus.BAD_REQUEST);
    }
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
