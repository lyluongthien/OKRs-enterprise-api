import { Module } from '@nestjs/common';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CheckinRepository } from './checkin.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CheckinEntity, CheckinRepository])],
  controllers: [CheckinController],
  providers: [CheckinService],
})
export class CheckinModule {}
