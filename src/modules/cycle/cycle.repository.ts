import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { CycleEntity } from '@app/db/entities/cycle.entity';
import { CycleDTO, UpdateCycleDTO } from './cycle.dto';
import { DATABASE_EXCEPTION, DELETE_ERROR } from '@app/constants/app.exeption';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(CycleEntity)
export class CycleRepository extends Repository<CycleEntity> {
  public async getList(): Promise<CycleEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCycles(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = await this.createQueryBuilder('cycle').orderBy('cycle.updatedAt', 'DESC');
      return await paginate<CycleEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async searchCycles(options: IPaginationOptions, text: string): Promise<any> {
    try {
      const queryBuilder = await this.createQueryBuilder('cycle')
        .where('LOWER(cycle.name) like :text', { text: '%' + text + '%' })
        .orderBy('cycle.updatedAt', 'DESC');
      return await paginate<CycleEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async createCycle(data: CycleDTO): Promise<CycleEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCycleDetail(id: number): Promise<CycleEntity> {
    try {
      return await this.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateCycle(id: number, data: UpdateCycleDTO): Promise<CycleEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteCycle(id: number): Promise<ObjectLiteral> {
    let query;
    try {
      query = await this.delete({ id });
      const rowEffected: number = query.affected;
      return { rowEffected: rowEffected };
    } catch (error) {
      //view detail on: https://github.com/ryanleecode/postgres-error-codes/blob/master/src/index.ts#L82
      if (error.code == '23503') {
        throw new HttpException(DELETE_ERROR.message, DELETE_ERROR.statusCode);
      }
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCurrentCycle(currentDate: Date): Promise<CycleEntity> {
    try {
      return await this.createQueryBuilder('cycle')
        .where(':date BETWEEN cycle.startDate AND cycle.endDate', {
          date: currentDate,
        })
        .getOne();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
