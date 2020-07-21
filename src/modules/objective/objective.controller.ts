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
    return this._objectiveService.createOKRs(data, manager, user.id);
  }

  @Get(':id')
  public async viewDetailOKRs(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._objectiveService.getDetailOKRs(id);
  }

  @Get()
  public async viewOKRs(@Query('cycleID', ParseIntPipe) cycleID: number): Promise<ResponseModel> {
    return this._objectiveService.viewOKRs(cycleID);
  }

  @Delete(':id')
  public deleteOKRs(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._objectiveService.deleteOKRs(id);
  }
}
