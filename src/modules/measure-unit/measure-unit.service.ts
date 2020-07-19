import { Injectable, HttpStatus } from '@nestjs/common';
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

  public async createMeasureUnit(data: MeasureUnitDTO): Promise<ResponseModel> {
    const datas = await this._measureRepository.createMeasureUnit(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: datas,
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

  public async updateMeasureUnit(id: number, data: Partial<MeasureUnitDTO>): Promise<ResponseModel> {
    const datas = await this._measureRepository.updateMeasureUnit(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: datas,
    };
  }

  public async deleteMeasureUnit(id: number): Promise<ResponseModel> {
    const datas = await this._measureRepository.deleteMeasureUnit(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: datas,
    };
  }
}
