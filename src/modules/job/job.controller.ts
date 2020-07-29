import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { JobService } from './job.service';
import { JobDTO, updateJobDTO } from './job.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { RoleEnum } from '@app/constants/app.enums';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/role.decorator';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { ResponseModel } from '@app/constants/app.interface';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';

@Controller('/api/v1/jobs')
@SwaggerAPI()
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public async getJobs(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    if (text) {
      return this.jobService.searchJob(text, {
        page,
        limit,
        route: '',
      });
    }
    return this.jobService.getJobs({
      page,
      limit,
      route: '',
    });
  }

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public createJob(@Body() role: JobDTO): any {
    return this.jobService.createJob(role);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public getDetailJob(@Param('id', ParseIntPipe) id: number): any {
    return this.jobService.getJobDetail(id);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  public updateJob(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<updateJobDTO>): any {
    return this.jobService.updateJob(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public deleteJob(@Param('id', ParseIntPipe) id: number): any {
    return this.jobService.deleteJob(id);
  }
}
