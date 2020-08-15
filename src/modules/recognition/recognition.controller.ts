import { Controller, UseGuards, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';

import { AuthenticationGuard } from '../auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { RecognitionService } from './recognition.service';
import { ResponseModel } from '@app/constants/app.interface';
import { RecognitionDTO } from './recognition.dto';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { Transaction, EntityManager, TransactionManager } from 'typeorm';

@Controller('/api/v1/recognitions')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class RecognitionController {
  constructor(private _recognitionService: RecognitionService) {}

  @Get('/detail/:id')
  public async getRecognitionDetail(@Param('id', ParseIntPipe) recognitionId: number): Promise<ResponseModel> {
    return this._recognitionService.getRecognitionDetail(recognitionId);
  }

  @Post()
  @Transaction({ isolation: 'SERIALIZABLE' })
  public createRecognition(
    @Body() recognition: RecognitionDTO,
    @CurrentUser() user: UserEntity,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._recognitionService.createRecognition(recognition, user.id, manager);
  }
}
