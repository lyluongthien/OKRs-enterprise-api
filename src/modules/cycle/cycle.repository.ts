import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { CycleEntity } from '@app/db/entities/cycle.entity';
import { CycleDTO, updateCycleDTO } from './cycle.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(CycleEntity)
export class CycleRepository extends Repository<CycleEntity> {
  public async getList(): Promise<CycleEntity[]> {
    try {
      return await this.find();
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

  public async updateCycle(id: number, data: updateCycleDTO): Promise<CycleEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteCycle(id: number): Promise<ObjectLiteral> {
    try {
      await this.delete({ id });
      return { isDeleted: true };
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
