import { EntityRepository, Repository, ObjectLiteral } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CommonMessage } from '@app/constants/app.enums';
import { HttpStatus, HttpException } from '@nestjs/common';

import { LessonEntity } from '@app/db/entities/lesson.entity';
import { LessonDTO } from './lesson.dto';

@EntityRepository(LessonEntity)
export class LessonRepository extends Repository<LessonEntity> {
  public async getLessons(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('lesson').orderBy('lesson.id', 'ASC');
      return await paginate<LessonEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async createLesson(data: ObjectLiteral): Promise<LessonEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateLesson(id: number, data: LessonDTO): Promise<LessonEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteLesson(id: number): Promise<ObjectLiteral> {
    try {
      await this.delete({ id });
      return { isDeleted: true };
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async searchLessons(text: string, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('lesson').where('lesson.title like :text', {
        text: '%' + text + '%',
      });

      return await paginate<LessonEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
