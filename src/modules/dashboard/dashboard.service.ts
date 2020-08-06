import { Injectable, HttpStatus } from '@nestjs/common';

import { TopStarType, CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { FeedbackRepository } from '../feedback/feedback.repository';

@Injectable()
export class DashboardService {
  constructor(private _feedBackRepository: FeedbackRepository) {}

  public async getTopStars(cycleId: number, type: TopStarType): Promise<ResponseModel> {
    const data = await this._feedBackRepository.getTopStars(cycleId, type);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
