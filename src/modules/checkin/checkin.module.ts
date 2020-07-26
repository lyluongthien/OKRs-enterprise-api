import { Module } from '@nestjs/common';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CheckinRepository } from './checkin.repository';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { ObjectiveRepository } from '../objective/objective.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([CheckinEntity, CheckinRepository, KeyResultRepository, ObjectiveRepository]),
  ],
  controllers: [CheckinController],
  providers: [CheckinService],
})
export class CheckinModule {}
