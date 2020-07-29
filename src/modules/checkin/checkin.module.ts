import { Module } from '@nestjs/common';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CheckinRepository } from './checkin.repository';
import { KeyResultRepository } from '../keyresult/keyresult.repository';
import { ObjectiveRepository } from '../objective/objective.repository';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      CheckinEntity,
      CheckinRepository,
      KeyResultRepository,
      ObjectiveRepository,
      UserRepository,
    ]),
  ],
  controllers: [CheckinController],
  providers: [CheckinService],
})
export class CheckinModule {}
