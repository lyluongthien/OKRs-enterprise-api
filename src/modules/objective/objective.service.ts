import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { ObjectiveRepository } from './objective.repository';

@Injectable()
export class ObjectiveService {
  constructor(private _objectiveRepository: ObjectiveRepository, private connection: Connection) {}
}
