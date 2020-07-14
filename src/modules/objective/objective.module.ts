import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { ObjectiveRepository } from './objective.repository';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { ObjectiveController } from './objective.controller';
import { ObjectiveService } from './objective.service';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectiveEntity, ObjectiveRepository, KeyResultRepository])],
  controllers: [ObjectiveController],
  providers: [ObjectiveService],
})
export class ObjectiveModule {}
