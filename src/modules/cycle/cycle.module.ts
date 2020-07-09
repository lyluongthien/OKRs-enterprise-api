import { Module } from '@nestjs/common';
import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';

@Module({
  controllers: [CycleController],
  providers: [CycleService],
})
export class CycleModule {}
