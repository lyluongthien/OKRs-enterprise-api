import { Controller, Post, UsePipes, Body } from '@nestjs/common';

import { KeyResultService } from './keyresult.service';
import { KeyResultDTO } from './keyresult.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';

@Controller('/api/v1/key-results')
export class KeyResultController {
  constructor(private _keyResultService: KeyResultService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  public createKeyResult(@Body() keyresult: KeyResultDTO[]): Promise<void> {
    return this._keyResultService.createKeyResult(keyresult);
  }
}
