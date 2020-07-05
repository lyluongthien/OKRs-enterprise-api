import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamRepository } from './team.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity, TeamRepository])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
