import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'src/db/DbConnection.module';
import accessEnv from '@helpers/accessEnv';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static appPort: number | string;

  constructor() {
    AppModule.appPort = accessEnv('SERVER_PORT', null);
  }
}
