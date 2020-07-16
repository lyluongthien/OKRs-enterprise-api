import { Controller, Post, UsePipes, Body, UseGuards } from '@nestjs/common';

import { KeyResultService } from './keyresult.service';
import { KeyResultDTO } from './keyresult.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { ResponseModel } from '@app/constants/app.interface';

@Controller('/api/v1/key-results')
export class KeyResultController {
  constructor(private _keyResultService: KeyResultService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthenticationGuard)
  public createKeyResult(@Body() keyresult: KeyResultDTO[]): Promise<ResponseModel> {
    return this._keyResultService.createKeyResult(keyresult);
  }
}
