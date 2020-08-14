import { Controller, Post, UsePipes, Body, Get, Query, Param, UseGuards, Delete, ParseIntPipe } from '@nestjs/common';

import { ObjectiveService } from './objective.service';
import { OkrsDTO } from './objective.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { ResponseModel } from '@app/constants/app.interface';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { OKRsLeaderType } from '@app/constants/app.enums';

@Controller('/api/v1/objectives')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class ObjectiveController {
  constructor(private _objectiveService: ObjectiveService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public createOKRs(
    @CurrentUser() user: UserEntity,
    @Body() data: OkrsDTO,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._objectiveService.createAndUpdateOKRs(data, manager, user.id);
  }

  @Get('/team_leaders')
  public async getAllTeamLeaderOKRs(
    @Query('id', ParseIntPipe) id: number,
    @Query('type', ParseIntPipe) type: OKRsLeaderType,
  ): Promise<ResponseModel> {
    return this._objectiveService.getTeamLeaderOKRs(id, type);
  }

  @Get('/staffs')
  public async getOKRsStaffs(): Promise<ResponseModel> {
    return this._objectiveService.getOKRsStaffs();
  }

  @Get('/search')
  public async searchOKRs(
    @Query('cycleId', ParseIntPipe) cycleId: number,
    @Query('userId', ParseIntPipe) id: number,
  ): Promise<ResponseModel> {
    return this._objectiveService.searchOKRs(cycleId, id);
  }

  @Get('/view_list')
  public async viewListOKRs(
    @Query('cycleId', ParseIntPipe) cycleId: number,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseModel> {
    return this._objectiveService.viewListOKRs(cycleId, user.id);
  }

  @Get('/detail/:id')
  public async viewDetailOKRs(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._objectiveService.getDetailOKRs(id);
  }

  @Delete(':objectiveId')
  @Transaction({ isolation: 'SERIALIZABLE' })
  public deleteOKRs(
    @CurrentUser() me: UserEntity,
    @Param('objectiveId', ParseIntPipe) objectiveId: number,
    @TransactionManager() manager: EntityManager,
  ): Promise<ResponseModel> {
    return this._objectiveService.deleteOKRs(objectiveId, me.id, manager);
  }
}
