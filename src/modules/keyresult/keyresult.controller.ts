import { Controller, Post, UsePipes, Body, UseGuards, Delete, Param, Put, ParseIntPipe } from '@nestjs/common';

import { KeyResultService } from './keyresult.service';
import { KeyResultDTO } from './keyresult.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';
import { ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { CommonMessage } from '@app/constants/app.enums';

@Controller('/api/v1/key_results')
@UseGuards(AuthenticationGuard)
export class KeyResultController {
  constructor(private _keyResultService: KeyResultService) {}

  @Post()
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  @UsePipes(new ValidationPipe())
  public createKeyResult(@Body() keyresult: KeyResultDTO[]): Promise<ResponseModel> {
    return this._keyResultService.createKeyResult(keyresult);
  }

  @Delete(':id')
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public deleteKeyResult(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._keyResultService.deleteKeyResult(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  @UsePipes(new ValidationPipe())
  public updateLesson(@Param('id', ParseIntPipe) id: number, @Body() data: KeyResultDTO): Promise<ResponseModel> {
    return this._keyResultService.updateKeyresults(id, data);
  }
}
