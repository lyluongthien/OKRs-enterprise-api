import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DatabaseConnectionService } from './db/database-connetion.service';
import { RoleModule } from './modules/role/role.module';
import accessEnv from './libs/accessEnv';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    RoleModule,
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
