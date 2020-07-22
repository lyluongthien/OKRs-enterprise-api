import { Controller, Get, UseGuards, Post, Body, UsePipes, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';

import { CheckinService } from './checkin.service';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';
import { CreateCheckinDTO } from './checkin.dto';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';

@Controller('/api/v1/checkins')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class CheckinController {
  constructor(private readonly _checkinService: CheckinService) {}

  /**
   * @description: Get Checkin detail by checkinId
   * @returns: Checkin in detail
   */
  @Get(':checkinId')
  @UsePipes(new ValidationPipe())
  public async getCheckin(@Param('checkinId', ParseIntPipe) checkinId: number): Promise<ResponseModel> {
    return this._checkinService.getCheckinDetail(checkinId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public async createCheckin(
    // @Query('status') status: string,
    @Body() data: CreateCheckinDTO,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._checkinService.createUpdateCheckin(data, manager);
  }
}
