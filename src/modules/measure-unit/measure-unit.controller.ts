import { Controller, Post, Body, Param, Put, Delete, UsePipes, Get } from '@nestjs/common';

import { MeasureUnitService } from './measure-unit.service';
import { MeasureUnitDTO } from './measure-unit.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { MeasureUnitEntity } from '@app/db/entities/measure-unit.entity';

@Controller('/api/v1/measure-unit')
export class MeasureUnitController {
  constructor(private _measureService: MeasureUnitService) {}

  @Get()
  public getAllMeasureUnit(): Promise<MeasureUnitEntity[]> {
    return this._measureService.getListMeasureUnit();
  }

  @Get(':id')
  public getMeasureUnitDetail(@Param('id') id: number): Promise<MeasureUnitEntity> {
    return this._measureService.getMeasureUnitDetail(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  public createMeasureUnit(@Body() role: MeasureUnitDTO): Promise<MeasureUnitEntity> {
    return this._measureService.createMeasureUnit(role);
  }

  @Put(':id')
  public updateMeasureUnit(@Param('id') id: number, @Body() data: MeasureUnitDTO): Promise<MeasureUnitEntity> {
    return this._measureService.updateMeasureUnit(id, data);
  }

  @Delete(':id')
  public deleteMeasureUnit(@Param('id') id: number): any {
    return this._measureService.deleteMeasureUnit(id);
  }
}
