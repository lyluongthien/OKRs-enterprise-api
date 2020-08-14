import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { RecognitionEntity } from '@app/db/entities/recognition.entity';
import { RecognitionDTO } from './recognition.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(RecognitionEntity)
export class RecognitionRepository extends Repository<RecognitionEntity> {
  public async createRecognition(data: RecognitionDTO, senderId: number): Promise<RecognitionEntity> {
    try {
      data.senderId = senderId;
      return await this.save(data);
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

  public async getAllRecognitions(cycleId: number): Promise<ObjectLiteral[]> {
    try {
      return await this.createQueryBuilder('recognition')
        .select([
          'recognition.id',
          'criteria.content',
          'sender.fullName',
          'sender.avatarURL',
          'sender.gravatarURL',
          'receiver.fullName',
          'receiver.avatarURL',
          'receiver.gravatarURL',
          'recognition.createdAt',
        ])
        .leftJoin('recognition.evaluationCriteria', 'criteria')
        .leftJoin('recognition.sender', 'sender')
        .leftJoin('recognition.receiver', 'receiver')
        .where('recognition.cycleId = :cycleId', { cycleId: cycleId })
        .getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
