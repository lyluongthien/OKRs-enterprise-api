import { Controller, Post, UsePipes, Body, Get, Query, Param, UseGuards } from '@nestjs/common';

import { ObjectiveService } from './objective.service';
import { OkrsDTO } from './objective.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { ResponseModel } from '@app/constants/app.interface';
import { AuthenticationGuard } from '../auth/authentication.guard';

@Controller('/api/v1/objectives')
export class ObjectiveController {
  constructor(private _objectiveService: ObjectiveService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthenticationGuard)
  @Transaction({ isolation: 'SERIALIZABLE' })
  public createOKRs(@Body() data: OkrsDTO, @TransactionManager() manager?: EntityManager): Promise<ResponseModel> {
    return this._objectiveService.createOKRs(data, manager);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  public async viewDetailOKRs(@Param('id') id: number): Promise<ResponseModel> {
    return this._objectiveService.getDetailOKRs(id);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  public async viewOKRs(
    @Query('cycleID') cycleID: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseModel> {
    return this._objectiveService.viewOKRs({ page, limit }, cycleID);
  }
}
