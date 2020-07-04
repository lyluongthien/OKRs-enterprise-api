import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes } from '@nestjs/common';

import { JobService } from './job.service';
import { JobDTO } from './job.dto';
import { ValidationPipe } from '@app/core/pipes/validation.pipe';

@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  private showAllJob(): any {
    return this.jobService.getListJob();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  private createJob(@Body() role: JobDTO): any {
    return this.jobService.createJob(role);
  }

  @Get(':id')
  private getDetailJob(@Param('id') id: number): any {
    return this.jobService.getJobDetail(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  private updateJob(@Param('id') id: number, @Body() data: JobDTO): any {
    return this.jobService.updateJob(id, data);
  }

  @Delete(':id')
  private deleteJob(@Param('id') id: number): any {
    return this.jobService.deleteJob(id);
  }
}
