import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DatabaseConnectionService } from './db/database-connetion.service';
import { RoleModule } from './modules/role/role.module';
import accessEnv from './libs/accessEnv';
import { UserModule } from './modules/user/user.module';
import { JobModule } from './modules/job/job.module';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    RoleModule,
    UserModule,
    JobModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;

  constructor() {
    AppModule.port = accessEnv('SERVER_PORT');
  }
}
