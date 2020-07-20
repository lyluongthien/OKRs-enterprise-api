import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';
import { CycleEntity } from '@app/db/entities/cycle.entity';
import { CycleRepository } from './cycle.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([CycleEntity, CycleRepository])],
  controllers: [CycleController],
  providers: [CycleService],
})
export class CycleModule {}
