import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';

import { ObjectiveDTO } from './objective.dto';
import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<ObjectiveEntity> {
  public async createObjective(data: ObjectiveDTO): Promise<ObjectLiteral> {
    await this.save(data);
    return null;
  }

  public async viewOKRs(cycleID: number): Promise<ObjectiveEntity[]> {
    try {
      const queryBuilder = this.createQueryBuilder('objective')
        .leftJoinAndSelect('objective.parentObjectives', 'childObjective')
        .leftJoinAndSelect('objective.keyResults', 'keyresults')
        .leftJoinAndSelect('objective.user', 'user')
        .where('objective.cycleId = :id', { id: cycleID })
        .getMany();
      return queryBuilder;
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
  public async getDetailOKRs(id: number): Promise<ObjectiveEntity> {
    try {
      return await this.findOne({
        relations: ['keyResults', 'user'],
        where: { id },
      });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
