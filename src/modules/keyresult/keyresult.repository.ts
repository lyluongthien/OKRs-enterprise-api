import { KeyResultDTO } from './keyresult.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';

import { Repository, EntityRepository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(KeyResultEntity)
export class KeyResultRepository extends Repository<KeyResultEntity> {
  public async createKeyResult(data: KeyResultDTO[]): Promise<void> {
    try {
      this.save(data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteKeyResults(id: number): Promise<number> {
    try {
      return (await this.delete({ id })).affected;
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateKeyResults(id: number, data: KeyResultDTO): Promise<void> {
    try {
      await this.update({ id }, data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getCheckinKeyResult(objectiveId: number): Promise<KeyResultEntity[]> {
    try {
      const queryBuilder = await this.createQueryBuilder('keyResult')
        .select([
          'keyResult.id',
          'keyResult.targetValue',
          'keyResult.startValue',
          'keyResult.valueObtained',
          'keyResult.content',
          'checkins.id',
          'checkins.valueObtained',
          'checkins.confidentLevel',
          'checkins.progress',
          'checkins.problems',
          'checkins.plans',
          'checkins.checkinAt',
          'checkins.nextCheckinDate',
          'checkins.status',
        ])
        .leftJoinAndSelect('keyResult.checkins', 'checkins')
        .where('keyResult.objectiveId= :id', { id: objectiveId })
        .getMany();
      return queryBuilder;
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
