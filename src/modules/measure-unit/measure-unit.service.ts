import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

import { MeasureUnitEntity } from '@app/db/entities/measure-unit.entity';
import { MeasureRepository } from './measure-unit.repository';
import { MeasureUnitDTO } from './measure-unit.dto';

@Injectable()
export class MeasureUnitService {
  constructor(private measureRepository: MeasureRepository) {}

  public getListMeasureUnit(): Promise<MeasureUnitEntity[]> {
    return this.measureRepository.getList();
  }

  public createMeasureUnit(data: MeasureUnitDTO): Promise<MeasureUnitEntity> {
    return this.measureRepository.createMeasureUnit(data);
  }

  public getMeasureUnitDetail(id: number): Promise<MeasureUnitEntity> {
    return this.measureRepository.getMeasureUnitDetail(id);
  }

  public updateMeasureUnit(id: number, data: Partial<MeasureUnitDTO>): Promise<MeasureUnitEntity> {
    return this.measureRepository.updateMeasureUnit(id, data);
  }

  public deleteMeasureUnit(id: number): Promise<ObjectLiteral> {
    return this.measureRepository.deleteMeasureUnit(id);
  }
}
