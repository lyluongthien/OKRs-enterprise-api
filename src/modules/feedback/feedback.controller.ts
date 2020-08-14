import { Controller, UseGuards, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';

import { AuthenticationGuard } from '@app/modules/auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { FeedbackService } from './feedback.service';
import { ResponseModel } from '@app/constants/app.interface';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { FeedbackDTO } from './feedback.dto';

@Controller('/api/v1/feedback')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class FeedbackController {
  constructor(private _feedBackService: FeedbackService) {}

  @Get('/list_waiting/:cycleId')
  public async listWaitingFeedBack(
    @CurrentUser() me: UserEntity,
    @Param('cycleId', ParseIntPipe) cycleId: number,
  ): Promise<ResponseModel> {
    return this._feedBackService.listWaitingFeedBack(me.id, cycleId);
  }

  @Get('/search/:cycleId')
  public async searchListWaitingFeedback(
    @CurrentUser() me: UserEntity,
    @Param('cycleId', ParseIntPipe) cycleId: number,
    @Query('text') text: string,
  ): Promise<ResponseModel> {
    return this._feedBackService.searchListWaitingFeedBack(text, me.id, cycleId);
  }

  @Post()
  @Transaction({ isolation: 'SERIALIZABLE' })
  public async createFeedBack(
    @CurrentUser() me: UserEntity,
    @Body() data: FeedbackDTO,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._feedBackService.createFeedBack(data, me.id, manager);
  }
}
