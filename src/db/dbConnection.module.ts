import { Module } from '@nestjs/common';
import { databaseProviders } from './dbConnection.service';

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
