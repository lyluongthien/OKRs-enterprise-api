import { Injectable, HttpStatus } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class FeedbackService {
  constructor(private _feedBackRepository: FeedbackRepository) {}

  public async viewListCFRsTeam(id: number): Promise<ResponseModel> {
    const data = await this._feedBackRepository.viewListCFRsTeam(id);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
