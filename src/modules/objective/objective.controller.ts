import { Controller, Post, UsePipes, Body } from '@nestjs/common';

import { ObjectiveService } from './objective.service';
import { OkrsDTO } from './objective.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';

@Controller('/api/v1/objectives')
export class ObjectiveController {
  constructor(private _objectiveService: ObjectiveService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  @Transaction({ isolation: 'SERIALIZABLE' })
  public createOKRs(@Body() data: OkrsDTO, @TransactionManager() manager?: EntityManager): Promise<void> {
    return this._objectiveService.createOKRs(data, manager);
  }
}
