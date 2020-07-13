import { Controller, Post } from '@nestjs/common';

import { ObjectiveService } from './objective.service';

@Controller('/api/v1/objectives')
export class ObjectiveController {
  constructor(private _objectiveService: ObjectiveService) {}
}
