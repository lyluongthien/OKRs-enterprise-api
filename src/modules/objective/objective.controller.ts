import { Controller, Post, UsePipes, Body } from '@nestjs/common';

import { ObjectiveService } from './objective.service';
import { OkrsDTO } from './objective.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';

@Controller('/api/v1/objectives')
export class ObjectiveController {
  constructor(private _objectiveService: ObjectiveService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  public createOKRs(@Body() objective: OkrsDTO): Promise<OkrsDTO> {
    return this._objectiveService.createOKRs(objective);
  }
}
