import { Controller, Post, Body, Param, Put, Delete, UsePipes, Get, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

import { CycleService } from './cycle.service';
import { CycleDTO } from './cycle.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/role.decorator';
import { RoleEnum, CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';

@Controller('/api/v1/cycles')
@UseGuards(AuthenticationGuard)
export class CycleController {
  constructor(private _cycleService: CycleService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public getAllCycle(): Promise<ResponseModel> {
    return this._cycleService.getListCycle();
  }

  @Get(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public getCycleDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._cycleService.getCycleDetail(id);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public createCycle(@Body() role: CycleDTO): Promise<ResponseModel> {
    return this._cycleService.createCycle(role);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public updateCycle(@Param('id', ParseIntPipe) id: number, @Body() data: CycleDTO): Promise<ResponseModel> {
    return this._cycleService.updateCycle(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public deleteCycle(@Param('id', ParseIntPipe) id: number): any {
    return this._cycleService.deleteCycle(id);
  }
}
