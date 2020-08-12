import { Controller, Post, UsePipes, Body, UseGuards, Delete, Param, Put, ParseIntPipe } from '@nestjs/common';

import { KeyResultService } from './keyresult.service';
import { KeyResultDTO } from './keyresult.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';

@Controller('/api/v1/key_results')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class KeyResultController {
  constructor(private _keyResultService: KeyResultService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  public createKeyResult(@Body() keyresult: KeyResultDTO[]): Promise<ResponseModel> {
    return this._keyResultService.createAndUpdateKeyResult(keyresult);
  }

  @Delete(':id')
  public deleteKeyResult(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._keyResultService.deleteKeyResult(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  public updateKeyResults(@Param('id', ParseIntPipe) id: number, @Body() data: KeyResultDTO): Promise<ResponseModel> {
    return this._keyResultService.updateKeyresults(id, data);
  }
}
