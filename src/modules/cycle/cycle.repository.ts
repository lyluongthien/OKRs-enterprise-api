import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { CycleEntity } from '@app/db/entities/cycle.entity';
import { CycleDTO, UpdateCycleDTO } from './cycle.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
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
    try {
      const rowEffected: number = (await this.delete({ id })).affected;
      return { rowEffected: rowEffected };
    } catch (error) {
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
