import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';

import { TopStarType } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { DashboardService } from './dashboard.service';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';

@Controller('/api/v1/dashboard')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class DashboardController {
  constructor(private _dashBoardService: DashboardService) {}

  @Get('/top_sender')
  public async getTopSenderStars(
    @Query('cycleId', ParseIntPipe) cycleId: number,
    @Query('type') type: TopStarType,
  ): Promise<ResponseModel> {
    return this._dashBoardService.getTopStars(cycleId, type);
  }
}
