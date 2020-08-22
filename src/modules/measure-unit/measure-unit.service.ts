import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { MeasureRepository } from './measure-unit.repository';
import { MeasureUnitDTO } from './measure-unit.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { MEASURE_EXIST } from '@app/constants/app.exeption';

@Injectable()
export class MeasureUnitService {
  constructor(private _measureRepository: MeasureRepository) {}

  public async getMeasureUnits(options: IPaginationOptions, text?: string): Promise<ResponseModel> {
    let data = null;
    if (text) {
      text = text.toLowerCase();
      data = await this._measureRepository.searchMeasureUnits(options, text);
    } else data = await this._measureRepository.getList(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createMeasureUnit(measureUnitDTO: MeasureUnitDTO): Promise<ResponseModel> {
    const measures = await this._measureRepository.getMeasureUnits();
    const checkMeasureExist = (measureParam) => measures.some(({ type }) => type == measureParam);
    if (checkMeasureExist(measureUnitDTO.type)) {
      throw new HttpException(MEASURE_EXIST.message, MEASURE_EXIST.statusCode);
    }
    const data = await this._measureRepository.createMeasureUnit(measureUnitDTO);
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
    const measures = await this._measureRepository.getMeasureUnits();
    const checkMeasureExist = (measureParam, currentId) =>
      measures.some(({ type, id }) => type == measureParam && currentId !== id);
    if (checkMeasureExist(measureUnitDTO.type, id)) {
      throw new HttpException(MEASURE_EXIST.message, MEASURE_EXIST.statusCode);
    }
    const data = await this._measureRepository.updateMeasureUnit(id, measureUnitDTO);
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
