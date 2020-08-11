import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';

import { TopStarType } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { DashboardService } from './dashboard.service';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';

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

  @Get('/view_progress')
  public async viewProgressOKRs(
    @Query('cycleId', ParseIntPipe) cycleId: number,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseModel> {
    return this._dashBoardService.viewOKRsProgress(cycleId, user.id);
  }

  @Get('/cfr_status')
  public async getCFRStatus(): Promise<ResponseModel> {
    return this._dashBoardService.getFirstAndLastDate();
  }
}
