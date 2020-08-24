import { Controller, UseGuards, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';

import { AuthenticationGuard } from '@app/modules/auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { CFRsService } from './cfrs.service';
import { ResponseModel } from '@app/constants/app.interface';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { CFRsDTO } from './cfrs.dto';
import { EvaluationCriteriaEnum, CFRsHistoryType } from '@app/constants/app.enums';

@Controller('/api/v1/cfrs')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class CFRsController {
  constructor(private _cfrsService: CFRsService) {}

  @Get('/list_waiting')
  public async listWaitingFeedBack(
    @CurrentUser() me: UserEntity,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseModel> {
    return this._cfrsService.listWaitingFeedBack(me.id, { page, limit });
  }

  @Get('/history')
  public async historyCFRs(
    @Query('userId') userId: number,
    @Query('cycleId', ParseIntPipe) cycleId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('type', ParseIntPipe) type: CFRsHistoryType,
  ): Promise<ResponseModel> {
    return this._cfrsService.getCFRsHistory(userId, cycleId, { page, limit }, type);
  }

  @Get('/detail/:id')
  public async getCFRsDetail(@Param('id', ParseIntPipe) cfrsId: number): Promise<ResponseModel> {
    return this._cfrsService.getDetailCFRs(cfrsId);
  }

  @Post()
  @Transaction({ isolation: 'SERIALIZABLE' })
  public async createCFRs(
    @CurrentUser() me: UserEntity,
    @Body() data: CFRsDTO,
    @Query('type') type: EvaluationCriteriaEnum,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._cfrsService.createCFRs(data, me.id, type, manager);
  }
}
