import { Controller, UseGuards, Get, Post, Body } from '@nestjs/common';

import { AuthenticationGuard } from '@app/modules/auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { FeedbackService } from './feedback.service';
import { ResponseModel } from '@app/constants/app.interface';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { FeedbackDTO } from './feedback.dto';
import { TransactionManager, EntityManager } from 'typeorm';

@Controller('/api/v1/feedback')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class FeedbackController {
  constructor(private _feedBackService: FeedbackService) {}

  @Get()
  public async ListWaitingFeedBack(@CurrentUser() me: UserEntity): Promise<ResponseModel> {
    return this._feedBackService.ListWaitingFeedBack(me.id);
  }

  @Post()
  public async createFeedBack(
    @CurrentUser() me: UserEntity,
    @Body() data: FeedbackDTO,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._feedBackService.createFeedBack(data, me.id, manager);
  }
}
