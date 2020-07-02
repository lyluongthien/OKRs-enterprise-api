import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { jobDTO } from './job.dto';

@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  private showAllJob(): any {
    return this.jobService.getListJob();
  }

  @Post()
  private createJob(@Body() role: jobDTO): any {
    return this.jobService.createJob(role);
  }

  @Get(':id')
  private getDetailJob(@Param('id') id: number): any {
    return this.jobService.getJobDetail(id);
  }

  @Put(':id')
  private updateJob(@Param('id') id: number, @Body() data: Partial<jobDTO>): any {
    return this.jobService.updateJob(id, data);
  }

  @Delete(':id')
  private deleteJob(@Param('id') id: number): any {
    return this.jobService.deleteJob(id);
  }
}
