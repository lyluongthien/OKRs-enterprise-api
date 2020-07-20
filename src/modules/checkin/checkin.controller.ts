import { Controller, Get, UseGuards, Post, Body, UsePipes, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';

import { CheckinService } from './checkin.service';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ApiCreatedResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';
import { CreateCheckinDTO } from './checkin.dto';

@Controller('/api/v1/checkins')
@UseGuards(AuthenticationGuard)
export class CheckinController {
  constructor(private readonly _checkinService: CheckinService) {}

  @Get(':objectiveId')
  @ApiCreatedResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  @UsePipes(new ValidationPipe())
  public async getCheckin(@Param('objectiveId', ParseIntPipe) objectiveId: number): Promise<ResponseModel> {
    return this._checkinService.getCheckinDetail(objectiveId);
  }

  @Post()
  @ApiCreatedResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  @UsePipes(new ValidationPipe())
  public async createCheckin(@Body() data: CreateCheckinDTO[]): Promise<ResponseModel> {
    return this._checkinService.createCheckin(data);
  }
}
