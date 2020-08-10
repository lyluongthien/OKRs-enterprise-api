import { Controller, Get, UseGuards, Post, Body, UsePipes, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';

import { CheckinService } from './checkin.service';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';
import { CreateCheckinDTO } from './checkin.dto';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';

@Controller('/api/v1/checkins')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class CheckinController {
  constructor(private readonly _checkinService: CheckinService) {}

  @Get('weekly_checkin')
  public async getWeeklyCheckin(): Promise<ResponseModel> {
    return this._checkinService.getWeeklyCheckin();
  }
  /**
   * @description: Get Checkin detail by checkinId
   * @returns: Checkin in detail
   */
  @Get(':checkinId')
  @UsePipes(new ValidationPipe())
  public async getCheckin(@Param('checkinId', ParseIntPipe) checkinId: number): Promise<ResponseModel> {
    return this._checkinService.getCheckinDetail(checkinId);
  }

  /**
   * @description: Get Checkin history of each objective
   * @returns: List history checkin getHistoryCheckin
   */
  @Get('history/:objectiveId')
  @UsePipes(new ValidationPipe())
  public async getHistoryCheckin(@Param('objectiveId', ParseIntPipe) objectiveId: number): Promise<ResponseModel> {
    return this._checkinService.getHistoryCheckin(objectiveId);
  }

  @Get('checkin_request/:cycleId')
  @UsePipes(new ValidationPipe())
  public async getCheckinRequest(
    @Param('cycleId', ParseIntPipe) cycleId: number,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseModel> {
    return this._checkinService.getCheckinRequest(user.id, cycleId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public async createAndUpdateCheckin(
    @Body() data: CreateCheckinDTO,
    @CurrentUser() user: UserEntity,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._checkinService.createUpdateCheckin(data, manager, user.id);
  }
}
