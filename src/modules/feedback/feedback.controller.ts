import { Controller, UseGuards, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';

import { AuthenticationGuard } from '@app/modules/auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { FeedbackService } from './feedback.service';
import { ResponseModel } from '@app/constants/app.interface';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { FeedbackDTO } from './feedback.dto';
import { TopStarType } from '@app/constants/app.enums';

@Controller('/api/v1/feedback')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class FeedbackController {
  constructor(private _feedBackService: FeedbackService) {}

  @Get()
  public async getCFRsTeam(@CurrentUser() me: UserEntity): Promise<ResponseModel> {
    return this._feedBackService.viewListCFRs(me);
  }

  @Get('/top_sender')
  public async getTopSenderStars(
    @Query('cycleId', ParseIntPipe) cycleId: number,
    @Query('type') type: TopStarType,
  ): Promise<ResponseModel> {
    return this._feedBackService.getTopStars(cycleId, type);
  }

  @Post()
  public async createFeedBack(@Body() data: FeedbackDTO, @CurrentUser() me: UserEntity): Promise<ResponseModel> {
    return this._feedBackService.createFeedBack(data, me.id);
  }
}
