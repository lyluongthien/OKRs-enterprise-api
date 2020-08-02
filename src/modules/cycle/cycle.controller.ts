import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  Get,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { CycleService } from './cycle.service';
import { CycleDTO, UpdateCycleDTO } from './cycle.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/role.decorator';
import { RoleEnum, CycleStatus } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';

@Controller('/api/v1/cycles')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class CycleController {
  constructor(private _cycleService: CycleService) {}

  @Get('/current_cycle')
  public getCurrentCycle(): Promise<ResponseModel> {
    return this._cycleService.getCycle(CycleStatus.CURRENT);
  }

  @Get()
  public getCycles(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._cycleService.getCycle(null, {
      page,
      limit,
    });
  }

  @Get(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  public getCycleDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._cycleService.getCycleDetail(id);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  public createCycle(@Body() cycle: CycleDTO): Promise<ResponseModel> {
    return this._cycleService.createCycle(cycle);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  public updateCycle(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCycleDTO): Promise<ResponseModel> {
    return this._cycleService.updateCycle(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  public deleteCycle(@Param('id', ParseIntPipe) id: number): any {
    return this._cycleService.deleteCycle(id);
  }
}
