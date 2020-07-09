import { Controller, Post, Body, Param, Put, Delete, UsePipes, Get } from '@nestjs/common';

import { CycleService } from './cycle.service';
import { CycleDTO } from './cycle.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { CycleEntity } from '@app/db/entities/cycle.entity';

@Controller('/api/v1/cycles')
export class CycleController {
  constructor(private cycleService: CycleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  public createCycle(@Body() role: CycleDTO): Promise<CycleEntity> {
    return this.cycleService.createCycle(role);
  }

  @Get(':id')
  private getCycleDetail(@Param('id') id: number): Promise<CycleEntity> {
    return this.cycleService.getCycleDetail(id);
  }

  @Put(':id')
  private updateCycle(@Param('id') id: number, @Body() data: Partial<CycleDTO>): Promise<CycleEntity> {
    return this.cycleService.updateCycle(id, data);
  }

  @Delete(':id')
  private deleteCycle(@Param('id') id: number): any {
    return this.cycleService.deleteCycle(id);
  }
}
