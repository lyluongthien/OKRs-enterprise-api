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

import { MeasureUnitService } from './measure-unit.service';
import { MeasureUnitDTO } from './measure-unit.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';
import { RoleEnum } from '@app/constants/app.enums';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/role.decorator';
import { ResponseModel } from '@app/constants/app.interface';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';

@Controller('/api/v1/measure_units')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class MeasureUnitController {
  constructor(private _measureService: MeasureUnitService) {}

  @Get()
  public getMeasureUnits(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._measureService.getMeasureUnits({ page, limit });
  }

  @Get(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public getMeasureUnitDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._measureService.getMeasureUnitDetail(id);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  public createMeasureUnit(@Body() role: MeasureUnitDTO): Promise<ResponseModel> {
    return this._measureService.createMeasureUnit(role);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public updateMeasureUnit(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: MeasureUnitDTO,
  ): Promise<ResponseModel> {
    return this._measureService.updateMeasureUnit(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public deleteMeasureUnit(@Param('id', ParseIntPipe) id: number): any {
    return this._measureService.deleteMeasureUnit(id);
  }
}
