import { Controller, UseGuards, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';

import { AuthenticationGuard } from '@app/modules/auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { FeedbackService } from './feedback.service';
import { ResponseModel } from '@app/constants/app.interface';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { FeedbackDTO } from './feedback.dto';
import { EvaluationCriteriaEnum, CFRsHistoryType } from '@app/constants/app.enums';

@Controller('/api/v1/feedback')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class FeedbackController {
  constructor(private _feedBackService: FeedbackService) {}

  @Get('/list_waiting')
  public async listWaitingFeedBack(@CurrentUser() me: UserEntity): Promise<ResponseModel> {
    return this._feedBackService.listWaitingFeedBack(me.id);
  }

  @Get('/history')
  public async historyCFRs(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('cycleId', ParseIntPipe) cycleId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('type', ParseIntPipe) type: CFRsHistoryType,
  ): Promise<ResponseModel> {
    return this._feedBackService.getCFRsHistory(userId, cycleId, { page, limit }, type);
  }

  @Get('/detail/:id')
  public async getFeedbackDetail(@Param('id', ParseIntPipe) feedbackId: number): Promise<ResponseModel> {
    return this._feedBackService.getDetailFeedback(feedbackId);
  }

  @Post()
  @Transaction({ isolation: 'SERIALIZABLE' })
  public async createFeedBack(
    @CurrentUser() me: UserEntity,
    @Body() data: FeedbackDTO,
    @Query('type') type: EvaluationCriteriaEnum,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._feedBackService.createFeedBack(data, me.id, type, manager);
  }
}
