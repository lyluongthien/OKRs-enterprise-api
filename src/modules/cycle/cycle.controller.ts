import { Controller, Post, Body, Param, Put, Delete, UsePipes, Get } from '@nestjs/common';

import { CycleService } from './cycle.service';
import { CycleDTO } from './cycle.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { CycleEntity } from '@app/db/entities/cycle.entity';

@Controller('/api/v1/cycles')
export class CycleController {
  constructor(private _cycleService: CycleService) {}

  @Get()
  public getAllCycle(): Promise<CycleEntity[]> {
    return this._cycleService.getListCycle();
  }

  @Get(':id')
  public getCycleDetail(@Param('id') id: number): Promise<CycleEntity> {
    return this._cycleService.getCycleDetail(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  public createCycle(@Body() role: CycleDTO): Promise<CycleEntity> {
    return this._cycleService.createCycle(role);
  }

  @Put(':id')
  public updateCycle(@Param('id') id: number, @Body() data: CycleDTO): Promise<CycleEntity> {
    return this._cycleService.updateCycle(id, data);
  }

  @Delete(':id')
  public deleteCycle(@Param('id') id: number): any {
    return this._cycleService.deleteCycle(id);
  }
}
