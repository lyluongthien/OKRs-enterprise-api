import { Controller, Post, Body, Param, Put, Delete, UsePipes, Get } from '@nestjs/common';

import { MeasureUnitService } from './measure-unit.service';
import { MeasureUnitDTO } from './measure-unit.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { MeasureUnitEntity } from '@app/db/entities/measure-unit.entity';

@Controller('/api/v1/measure-unit')
export class MeasureUnitController {
  constructor(private measureService: MeasureUnitService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  public createMeasureUnit(@Body() role: MeasureUnitDTO): Promise<MeasureUnitEntity> {
    return this.measureService.createMeasureUnit(role);
  }

  @Get(':id')
  private getMeasureUnitDetail(@Param('id') id: number): Promise<MeasureUnitEntity> {
    return this.measureService.getMeasureUnitDetail(id);
  }

  @Put(':id')
  private updateMeasureUnit(@Param('id') id: number, @Body() data: MeasureUnitDTO): Promise<MeasureUnitEntity> {
    return this.measureService.updateMeasureUnit(id, data);
  }

  @Delete(':id')
  private deleteMeasureUnit(@Param('id') id: number): any {
    return this.measureService.deleteMeasureUnit(id);
  }
}
