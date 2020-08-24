import { Repository, EntityRepository, ObjectLiteral, EntityManager } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { CFRsEntity } from '@app/db/entities/cfrs.entity';
import { RecognitionDTO } from './recognition.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(CFRsEntity)
export class RecognitionRepository extends Repository<CFRsEntity> {
  public async createRecognition(data: RecognitionDTO, manager: EntityManager): Promise<CFRsEntity> {
    try {
      return await manager.getRepository(CFRsEntity).save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getRecognitionInWeek(
    firstDay: string,
    lastDay: string,
    firstOfLastWeek: string,
    lastOfLastWeek: string,
  ): Promise<ObjectLiteral[]> {
    try {
      const query = ` SELECT 
          Sum(reg.numberOfRecognition) AS numberOfRecognition,
          Sum(coalesce(reg.numberOfRecognition, 0) - coalesce(regLastWeek.numberOfLastRecognition, 0)) AS changing
        FROM
        (SELECT r.id,
         count(r.id) AS numberOfRecognition
          FROM recognitions r
          WHERE r."createdAt" BETWEEN '${firstDay}' AND '${lastDay}'
          GROUP BY r.id)AS reg
        FULL OUTER JOIN
        (SELECT r.id,
                count(r.id) AS numberOfLastRecognition
          FROM recognitions r
          WHERE r."createdAt" BETWEEN '${firstOfLastWeek}' AND '${lastOfLastWeek}'
          GROUP BY r.id) AS regLastWeek ON reg.id = regLastWeek.id`;
      return await this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getRecognitionDetail(recognitionId: number): Promise<CFRsEntity[]> {
    try {
      return await this.createQueryBuilder('recognition')
        .select([
          'recognition.id',
          'criteria.content',
          'sender.fullName',
          'receiver.fullName',
          'recognition.content',
          'recognition.createdAt',
          'objective.title',
        ])
        .leftJoin('recognition.evaluationCriteria', 'criteria')
        .leftJoin('recognition.objective', 'objective')
        .leftJoin('recognition.sender', 'sender')
        .leftJoin('recognition.receiver', 'receiver')
        .where('recognition.id = :id', { id: recognitionId })
        .getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
