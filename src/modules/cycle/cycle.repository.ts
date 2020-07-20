import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { CycleEntity } from '@app/db/entities/cycle.entity';
import { CycleDTO } from './cycle.dto';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(CycleEntity)
export class CycleRepository extends Repository<CycleEntity> {
  public async getList(): Promise<CycleEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async createCycle(data: CycleDTO): Promise<CycleEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getCycleDetail(id: number): Promise<CycleEntity> {
    try {
      return await this.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateCycle(id: number, data: Partial<CycleDTO>): Promise<CycleEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteCycle(id: number): Promise<ObjectLiteral> {
    try {
      await this.delete({ id });
      return { isDeleted: true };
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
