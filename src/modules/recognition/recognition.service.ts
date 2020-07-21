import { Injectable, HttpStatus } from '@nestjs/common';
import { ResponseModel } from '@app/constants/app.interface';
import { RecognitionDTO } from './recognition.dto';
import { RecognitionRepository } from './recognition.repository';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class RecognitionService {
  constructor(private _recognitionRepository: RecognitionRepository) {}

  public async createRecognition(recognition: RecognitionDTO, superiorId: number): Promise<ResponseModel> {
    await this._recognitionRepository.createRecognition(recognition, superiorId);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }
}
