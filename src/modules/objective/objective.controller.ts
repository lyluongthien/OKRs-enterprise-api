import { Controller, Post, UsePipes, Body, Get, Query, Param } from '@nestjs/common';

import { ObjectiveService } from './objective.service';
import { OkrsDTO } from './objective.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ObjectiveEntity } from '@app/db/entities/objective.entity';

@Controller('/api/v1/objectives')
export class ObjectiveController {
  constructor(private _objectiveService: ObjectiveService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public createOKRs(@Body() data: OkrsDTO, @TransactionManager() manager?: EntityManager): Promise<void> {
    return this._objectiveService.createOKRs(data, manager);
  }

  @Get(':cycleID')
  public async viewObjectives(
    @Param('cycleID') cycleID: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Pagination<ObjectiveEntity>> {
    return this._objectiveService.viewObjectives({ page, limit }, cycleID);
  }
}
