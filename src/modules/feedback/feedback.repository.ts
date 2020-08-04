import { Repository, EntityRepository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { FeedbackEntity } from '@app/db/entities/feedback.entity';
import { FeedbackDTO } from './feedback.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(FeedbackEntity)
export class FeedbackRepository extends Repository<FeedbackEntity> {
  public async createFeedBack(data: FeedbackDTO, senderId: number): Promise<void> {
    try {
      data.senderId = senderId;
      this.save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
