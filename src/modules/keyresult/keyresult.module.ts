import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KeyResultEntity } from '@app/db/entities/key-result.entity';
import { KeyResultRepository } from './keyresult.repository';
import { KeyResultController } from './keyresult.controller';
import { KeyResultService } from './keyresult.service';

@Module({
  imports: [TypeOrmModule.forFeature([KeyResultEntity, KeyResultRepository])],
  controllers: [KeyResultController],
  providers: [KeyResultService],
})
export class KeyResultModule {}
