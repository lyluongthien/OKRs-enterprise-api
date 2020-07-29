import { Repository, EntityRepository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { RecognitionEntity } from '@app/db/entities/recognition.entity';
import { RecognitionDTO } from './recognition.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(RecognitionEntity)
export class RecognitionRepository extends Repository<RecognitionEntity> {
  public async createRecognition(data: RecognitionDTO, superiorId: number): Promise<RecognitionEntity> {
    try {
      data.superiorId = superiorId;
      return await this.save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
