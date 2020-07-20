import { Controller, Post, UsePipes, Body, Get, Query, Param, UseGuards, Delete, ParseIntPipe } from '@nestjs/common';

import { ObjectiveService } from './objective.service';
import { OkrsDTO } from './objective.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { ResponseModel } from '@app/constants/app.interface';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { CommonMessage } from '@app/constants/app.enums';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';

@Controller('/api/v1/objectives')
@UseGuards(AuthenticationGuard)
export class ObjectiveController {
  constructor(private _objectiveService: ObjectiveService) {}
  @Post()
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public createOKRs(
    @CurrentUser() user: UserEntity,
    @Body() data: OkrsDTO,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._objectiveService.createOKRs(data, manager, user.id);
  }

  @Get(':id')
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async viewDetailOKRs(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._objectiveService.getDetailOKRs(id);
  }

  @Get()
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async viewOKRs(@Query('cycleID', ParseIntPipe) cycleID: number): Promise<ResponseModel> {
    return this._objectiveService.viewOKRs(cycleID);
  }

  @Delete(':id')
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public deleteOKRs(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._objectiveService.deleteOKRs(id);
  }
}
