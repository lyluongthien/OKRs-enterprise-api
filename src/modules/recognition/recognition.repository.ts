import { Repository, EntityRepository } from 'typeorm';
import { HttpStatus, HttpException } from '@nestjs/common';

import { RecognitionEntity } from '@app/db/entities/recognition.entity';
import { CommonMessage } from '@app/constants/app.enums';
import { RecognitionDTO } from './recognition.dto';

@EntityRepository(RecognitionEntity)
export class RecognitionRepository extends Repository<RecognitionEntity> {
  public async createRecognition(data: RecognitionDTO, superiorId: number): Promise<RecognitionEntity> {
    try {
      data.superiorId = superiorId;
      return await this.save(data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
