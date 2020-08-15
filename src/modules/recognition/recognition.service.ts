import { Injectable, HttpStatus } from '@nestjs/common';
import { ResponseModel } from '@app/constants/app.interface';
import { RecognitionDTO } from './recognition.dto';
import { RecognitionRepository } from './recognition.repository';
import { CommonMessage } from '@app/constants/app.enums';
import { EntityManager } from 'typeorm';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { UserStarRepository } from '../user-star/user-star.repository';

@Injectable()
export class RecognitionService {
  constructor(
    private _recognitionRepository: RecognitionRepository,
    private _evaluationCriteriaRepository: EvaluationCriteriaRepository,
    private _cycleRepository: CycleRepository,
    private _userStarsRepository: UserStarRepository,
  ) {}

  public async createRecognition(
    recognition: RecognitionDTO,
    senderId: number,
    manager: EntityManager,
  ): Promise<ResponseModel> {
    if (recognition && senderId) {
      recognition.senderId = senderId;
      const cycleId = (await this._cycleRepository.getCurrentCycle(new Date())).id;
      recognition.cycleId = cycleId;
      const userStar = {
        star: (await this._evaluationCriteriaRepository.getCriteriaDetail(recognition.evaluationCriteriaId))
          .numberOfStar,
        cycleId: cycleId,
        userId: recognition.receiverId,
      };
      await this._userStarsRepository.createUserStar(userStar, manager);
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }
}
