import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';

import { CheckinService } from './checkin.service';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';
import { CreateCheckinDTO } from './checkin.dto';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';

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
   * @description: Get Checkin history of each objective
   * @returns: List history checkin getHistoryCheckin
   */
  @Get('history/:objectiveId')
  @UsePipes(new ValidationPipe())
  public async getHistoryCheckin(@Param('objectiveId', ParseIntPipe) objectiveId: number): Promise<ResponseModel> {
    return this._checkinService.getHistoryCheckin(objectiveId);
  }

  /**
   * @description: Leader get list checkin request of team member
   */
  @Get('checkin_request')
  @UsePipes(new ValidationPipe())
  public async getCheckinRequest(
    @Query('cycleId') cycleId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._checkinService.getCheckinRequest(user.id, cycleId, {
      page,
      limit,
      route: '',
    });
  }

  /**
   * @description: Leader Checkin detail request checkin
   */
  @Put('checkin_request/:checkinId')
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public async updateCheckinRequest(
    @Param('checkinId', ParseIntPipe) checkinId: number,
    @Body() data: CreateCheckinDTO,
    @CurrentUser() user: UserEntity,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._checkinService.updateCheckinRequest(data, manager, user.id, checkinId);
  }

  /**
   * @description: Get data model when create checkin
   */
  @Get('objective/:objectiveId')
  @UsePipes(new ValidationPipe())
  public async getCheckinObjective(
    @CurrentUser() user: UserEntity,
    @Param('objectiveId', ParseIntPipe) objectiveId: number,
  ): Promise<ResponseModel> {
    return await this._checkinService.getCheckinObjective(user.id, objectiveId);
  }

  /**
   * @description: Get list OKRs checkin of Admin
   */
  @Get('admin')
  @UsePipes(new ValidationPipe())
  public async getListOKRsCheckinAdmin(
    @CurrentUser() user: UserEntity,
    @Query('cycleId') cycleId: number,
  ): Promise<ResponseModel> {
    return await this._checkinService.getListOKRsCheckinAdmin(user.id, cycleId);
  }

  /**
   * @description: Get Checkin detail by checkinId
   * @returns: Checkin in detail
   */
  @Get(':checkinId')
  @UsePipes(new ValidationPipe())
  public async getCheckinDetail(
    @Param('checkinId', ParseIntPipe) checkinId: number,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseModel> {
    return this._checkinService.getCheckinDetail(checkinId, user.id);
  }

  @Get('/waiting_feedback_detail/:checkinId')
  @UsePipes(new ValidationPipe())
  public async getDetailListWaitingFeedback(
    @Param('checkinId', ParseIntPipe) checkinId: number,
  ): Promise<ResponseModel> {
    return this._checkinService.getDetailListWaitingFeedback(checkinId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public async createCheckin(
    @Body() data: CreateCheckinDTO,
    @CurrentUser() user: UserEntity,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._checkinService.createUpdateCheckin(data, manager, user.id);
  }

  /**
   * @description: Staff update checkin information
   */
  @Put(':checkinId')
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public async updateCheckin(
    @Param('checkinId', ParseIntPipe) checkinId: number,
    @Body() data: CreateCheckinDTO,
    @CurrentUser() user: UserEntity,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._checkinService.createUpdateCheckin(data, manager, user.id, checkinId);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  public async getListOKRsCheckin(
    @CurrentUser() user: UserEntity,
    @Query('cycleId') cycleId: number,
  ): Promise<ResponseModel> {
    return await this._checkinService.getListOKRsCheckin(user.id, cycleId);
  }
}
