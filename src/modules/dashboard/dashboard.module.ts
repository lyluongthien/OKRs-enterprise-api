import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserModule } from '../user/user.module';
import { CFRsRepository } from '../cfrs/cfrs.repository';
import { UserRepository } from '../user/user.repository';
import { ObjectiveRepository } from '../objective/objective.repository';
import { RoleRepository } from '../role/role.repository';
import { CheckinRepository } from '../checkin/checkin.repository';
import { CycleRepository } from '../cycle/cycle.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      CFRsRepository,
      UserRepository,
      ObjectiveRepository,
      RoleRepository,
      CheckinRepository,
      CycleRepository,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
