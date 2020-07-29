import { Module } from '@nestjs/common';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './recognition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecognitionEntity } from '@app/db/entities/recognition.entity';
import { RecognitionRepository } from './recognition.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RecognitionEntity, RecognitionRepository])],
  controllers: [RecognitionController],
  providers: [RecognitionService],
})
export class RecognitionModule {}
