import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { EvaluationDTO } from './evaluation-criteria.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { RouterEnum, RoleEnum } from '@app/constants/app.enums';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/role.decorator';
import { ResponseModel } from '@app/constants/app.interface';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';

@Controller('/api/v1/evaluation_criterias')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class EvaluationCriteriaController {
  constructor(private _evaluationCriteriaService: EvaluationCriteriaService) {}

  @Get()
  public getEvaluationCriterias(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._evaluationCriteriaService.getEvaluationCriterias({
      page,
      limit,
      route: RouterEnum.EVALUATION_CRITERIA_ROUTE,
    });
  }

  @Get(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  public getCriteriaDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._evaluationCriteriaService.getCriteriaDetail(id);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  public createCriteria(@Body() role: EvaluationDTO): Promise<ResponseModel> {
    return this._evaluationCriteriaService.createCriteria(role);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  public updateCriteria(@Param('id', ParseIntPipe) id: number, @Body() data: EvaluationDTO): Promise<ResponseModel> {
    return this._evaluationCriteriaService.updateCriteria(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  public deleteCriteria(@Param('id', ParseIntPipe) id: number): any {
    return this._evaluationCriteriaService.deleteCriteria(id);
  }
}
