import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { MeasureUnitEntity } from '@app/db/entities/measure-unit.entity';
import { MeasureUnitDTO } from './measure-unit.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(MeasureUnitEntity)
export class MeasureRepository extends Repository<MeasureUnitEntity> {
  public async getList(): Promise<MeasureUnitEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async createMeasureUnit(data: MeasureUnitDTO): Promise<MeasureUnitEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getMeasureUnitDetail(id: number): Promise<MeasureUnitEntity> {
    try {
      return await this.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateMeasureUnit(id: number, data: Partial<MeasureUnitDTO>): Promise<MeasureUnitEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteMeasureUnit(id: number): Promise<ObjectLiteral> {
    try {
      const rowEffected: number = await (await this.delete({ id })).affected;
      return { isDeleted: rowEffected === 1 ? true : false };
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
