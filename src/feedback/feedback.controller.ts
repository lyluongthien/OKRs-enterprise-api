import { Controller, UseGuards, Get, Param } from '@nestjs/common';

import { AuthenticationGuard } from '@app/modules/auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { FeedbackService } from './feedback.service';
import { ResponseModel } from '@app/constants/app.interface';

@Controller('/api/v1/feedback')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class FeedbackController {
  constructor(private _feedBackService: FeedbackService) {}

  @Get(':id')
  public async getCFRsTeam(@Param('id') id: number): Promise<ResponseModel> {
    return this._feedBackService.viewListCFRsTeam(id);
  }
}
