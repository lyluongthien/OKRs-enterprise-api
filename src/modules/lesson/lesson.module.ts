import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonEntity } from '@app/db/entities/lesson.entity';
import { LessonRepository } from './lesson.repository';
import { LessonService } from './lesson.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([LessonEntity, LessonRepository])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
