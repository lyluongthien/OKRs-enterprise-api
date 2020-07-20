import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UsePipes, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

import { JobService } from './job.service';
import { JobDTO } from './job.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CommonMessage, RoleEnum } from '@app/constants/app.enums';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/role.decorator';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';

@Controller('/api/v1/jobs')
@UseGuards(AuthenticationGuard)
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public showAllJob(): any {
    return this.jobService.getListJob();
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public createJob(@Body() role: JobDTO): any {
    return this.jobService.createJob(role);
  }

  @Get(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public getDetailJob(@Param('id', ParseIntPipe) id: number): any {
    return this.jobService.getJobDetail(id);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public updateJob(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<JobDTO>): any {
    return this.jobService.updateJob(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public deleteJob(@Param('id', ParseIntPipe) id: number): any {
    return this.jobService.deleteJob(id);
  }
}
