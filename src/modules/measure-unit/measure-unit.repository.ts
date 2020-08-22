import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { MeasureUnitEntity } from '@app/db/entities/measure-unit.entity';
import { MeasureUnitDTO } from './measure-unit.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(MeasureUnitEntity)
export class MeasureRepository extends Repository<MeasureUnitEntity> {
  public async getList(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = await this.createQueryBuilder('measure').orderBy({
        'measure.index': 'ASC',
        'measure.type': 'ASC',
      });
      return paginate<MeasureUnitEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async searchMeasureUnits(options: IPaginationOptions, text: string): Promise<any> {
    try {
      const queryBuilder = await this.createQueryBuilder('measure')
        .where('LOWER(measure.type) like :text', { text: '%' + text + '%' })
        .orderBy({
          'measure.index': 'ASC',
          'measure.type': 'ASC',
        });
      return paginate<MeasureUnitEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getMeasureUnits(): Promise<MeasureUnitEntity[]> {
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
      const rowEffected: number = (await this.delete({ id })).affected;
      return { rowEffected: rowEffected };
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
