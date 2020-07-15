import { Controller, Post, UsePipes, Body } from '@nestjs/common';

import { KeyResultService } from './keyresult.service';
import { KeyResultDTO } from './keyresult.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';

@Controller('/api/v1/key-results')
export class KeyResultController {
  constructor(private _keyResultService: KeyResultService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  public createKeyResult(@Body() keyresult: KeyResultDTO[]): Promise<KeyResultEntity> {
    return this._keyResultService.createKeyResult(keyresult);
  }
}
