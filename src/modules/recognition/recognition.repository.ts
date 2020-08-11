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
      return await this.query(`select Sum(reg.numberOfRecognition) as numberOfRecognition, 
      Sum(coalesce(reg.numberOfRecognition, 0) - coalesce(regLastWeek.numberOfLastRecognition, 0)) as changing from
      (select r.id, count(r.id) as numberOfRecognition from recognitions r 
      where r."createdAt" between '${firstDay}' and '${lastDay}'
      group by r.id)as reg
      full outer join 
      (select r.id, count(r.id) as numberOfLastRecognition from recognitions r 
      where r."createdAt" between '${firstOfLastWeek}' and '${lastOfLastWeek}'
      group by r.id) as regLastWeek on reg.id = regLastWeek.id`);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
