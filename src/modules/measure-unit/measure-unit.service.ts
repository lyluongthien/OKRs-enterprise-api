import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { MeasureUnitEntity } from '@app/db/entities/measure-unit.entity';
import { MeasureRepository } from './measure-unit.repository';
import { MeasureUnitDTO } from './measure-unit.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';

@Injectable()
export class MeasureUnitService {
  constructor(private _measureRepository: MeasureRepository) {}

  public async getMeasureUnits(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await paginate<MeasureUnitEntity>(this._measureRepository, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createMeasureUnit(measureUnitDTO: MeasureUnitDTO): Promise<ResponseModel> {
    const data = await this._measureRepository.createMeasureUnit(measureUnitDTO);
    const measures = await this._measureRepository.getList();
    const checkMeasureExist = (measureParam) => measures.some(({ preset }) => preset == measureParam);
    if (checkMeasureExist(measureUnitDTO.preset)) {
      throw new HttpException(CommonMessage.MEASURE_EXIST, HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getMeasureUnitDetail(id: number): Promise<ResponseModel> {
    const data = await this._measureRepository.getMeasureUnitDetail(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async updateMeasureUnit(id: number, measureUnitDTO: Partial<MeasureUnitDTO>): Promise<ResponseModel> {
    const data = await this._measureRepository.updateMeasureUnit(id, measureUnitDTO);
    const measures = await this._measureRepository.getList();
    const checkMeasureExist = (measureParam) => measures.some(({ preset }) => preset == measureParam);
    if (checkMeasureExist(measureUnitDTO.preset)) {
      throw new HttpException(CommonMessage.MEASURE_EXIST, HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async deleteMeasureUnit(id: number): Promise<ResponseModel> {
    const data = await this._measureRepository.deleteMeasureUnit(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
