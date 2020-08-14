import { KeyResultDTO } from './keyresult.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';

import { Repository, EntityRepository, EntityManager } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { DATABASE_EXCEPTION, TARGET_VALUE_INVALID } from '@app/constants/app.exeption';
import { CustomException } from '@app/services/exceptions/HandlerException';
import { DeleteKeyresultType } from '@app/constants/app.enums';

@EntityRepository(KeyResultEntity)
export class KeyResultRepository extends Repository<KeyResultEntity> {
  public async createAndUpdateKeyResult(data: KeyResultDTO[], manager?: EntityManager): Promise<void> {
    try {
      if (manager) {
        data.map((value) => {
          if (value.targetValue < 1 || value.targetValue <= value.valueObtained) {
            throw new CustomException();
          }
          return value;
        });
        await manager.getRepository(KeyResultEntity).save(data);
      } else {
        this.save(data);
      }
    } catch (error) {
      if (error instanceof CustomException) {
        throw new HttpException(TARGET_VALUE_INVALID.message, TARGET_VALUE_INVALID.statusCode);
      }
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getKeyResultsByUserId(userId: number): Promise<KeyResultEntity[]> {
    try {
      return await this.createQueryBuilder('keyresult')
        .select(['keyresult.id'])
        .leftJoin('keyresult.objective', 'objective')
        .where('objective.userId = :id', { id: userId })
        .getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getListKeyresultIds(): Promise<KeyResultEntity[]> {
    try {
      return await this.find({ select: ['id'] });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getDataObtainedByIds(id: number[]): Promise<KeyResultEntity[]> {
    try {
      return await this.createQueryBuilder('keyresult')
        .select(['keyresult.valueObtained'])
        .where('keyresult.id IN (:id)', { id: id })
        .getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteKeyResults(id: number, type: DeleteKeyresultType, manager?: EntityManager): Promise<number> {
    try {
      let rowEffected = -1;
      switch (type) {
        case DeleteKeyresultType.KEY_RESULT:
          if (manager) {
            rowEffected = (await manager.getRepository(KeyResultEntity).delete({ id })).affected;
          } else {
            rowEffected = (await this.delete({ id })).affected;
          }
          break;
        case DeleteKeyresultType.OKR:
          if (manager) {
            rowEffected = (await manager.getRepository(KeyResultEntity).delete({ objectiveId: id })).affected;
          } else {
            rowEffected = (await this.delete({ objectiveId: id })).affected;
          }
          break;
        default:
          rowEffected = -1;
          break;
      }

      return rowEffected;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateKeyResults(id: number, data: KeyResultDTO): Promise<void> {
    try {
      await this.update({ id }, data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
