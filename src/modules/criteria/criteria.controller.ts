import { Controller, Post, Body, Param, Put, Delete, UsePipes, Get, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CriteriaService } from './criteria.service';
import { CriteriaDTO } from './criteria.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { EvaluationCriteriaEntity } from '@app/db/entities/evaluation-criteria.entity';
import { RouterEnum, PagingEnum } from '@app/constants/app.enums';

@Controller('/api/v1/criterias')
export class CriteriaController {
  constructor(private _criteriaService: CriteriaService) {}

  @Get(':page')
  public getCriteriaByPage(@Query('page') page: number): Promise<Pagination<EvaluationCriteriaEntity>> {
    return this._criteriaService.getCriteriaByPage({
      page: page,
      limit: PagingEnum.ITEM_PER_PAGE,
      route: RouterEnum.CRITERIA_ROUTE,
    });
  }

  @Get(':id')
  public getCriteriaDetail(@Param('id') id: number): Promise<EvaluationCriteriaEntity> {
    return this._criteriaService.getCriteriaDetail(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  public createCriteria(@Body() role: CriteriaDTO): Promise<EvaluationCriteriaEntity> {
    return this._criteriaService.createCriteria(role);
  }

  @Put(':id')
  public updateCriteria(@Param('id') id: number, @Body() data: CriteriaDTO): Promise<EvaluationCriteriaEntity> {
    return this._criteriaService.updateCriteria(id, data);
  }

  @Delete(':id')
  public deleteCriteria(@Param('id') id: number): any {
    return this._criteriaService.deleteCriteria(id);
  }
}
