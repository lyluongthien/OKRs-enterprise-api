import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { MeasureUnitEntity } from '@app/db/entities/measure-unit.entity';
import { MeasureUnitDTO } from './measure-unit.dto';

import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(MeasureUnitEntity)
export class MeasureRepository extends Repository<MeasureUnitEntity> {
  public async getList(): Promise<MeasureUnitEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async createMeasureUnit(data: MeasureUnitDTO): Promise<MeasureUnitEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getMeasureUnitDetail(id: number): Promise<MeasureUnitEntity> {
    try {
      return await this.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateMeasureUnit(id: number, data: Partial<MeasureUnitDTO>): Promise<MeasureUnitEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteMeasureUnit(id: number): Promise<ObjectLiteral> {
    try {
      const rowEffected: number = await (await this.delete({ id })).affected;
      return { isDeleted: rowEffected === 1 ? true : false };
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
