import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamRepository } from './team.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([TeamEntity, TeamRepository])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
