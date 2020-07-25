import { Controller, UseGuards, Get, Param } from '@nestjs/common';

import { AuthenticationGuard } from '@app/modules/auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { FeedbackService } from './feedback.service';
import { ResponseModel } from '@app/constants/app.interface';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';

@Controller('/api/v1/feedback')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class FeedbackController {
  constructor(private _feedBackService: FeedbackService) {}

  @Get()
  public async getCFRsTeam(@CurrentUser() me: UserEntity): Promise<ResponseModel> {
    //return this._feedBackService.viewListTeamCFRs(id);
    return this._feedBackService.viewListCFRs(me);
  }
}
