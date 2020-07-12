import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';
import { CycleEntity } from '@app/db/entities/cycle.entity';
import { CycleRepository } from './cycle.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CycleEntity, CycleRepository])],
  controllers: [CycleController],
  providers: [CycleService],
})
export class CycleModule {}
