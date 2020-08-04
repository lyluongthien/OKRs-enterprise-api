import { EntityRepository, Repository, ObjectLiteral } from 'typeorm';
import { CommonMessage } from '@app/constants/app.enums';
import { HttpStatus, HttpException } from '@nestjs/common';

import { LessonEntity } from '@app/db/entities/lesson.entity';
import { LessonDTO } from './lesson.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(LessonEntity)
export class LessonRepository extends Repository<LessonEntity> {
  public async getLessons(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('lesson')
        .orderBy('lesson.index', 'ASC')
        .addOrderBy('lesson.updatedAt', 'DESC');
      return await paginate<LessonEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getDetailLesson(slug: string): Promise<LessonEntity> {
    try {
      const queryBuilder = this.createQueryBuilder('lesson').where('lesson.slug = :slug', { slug: slug }).getOne();
      return await queryBuilder;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async searchLessons(title: string, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('lesson')
        .where('lesson.title like :text', {
          text: '%' + title + '%',
        })
        .orderBy('lesson.id', 'ASC');
      return await paginate<LessonEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async createLesson(data: ObjectLiteral): Promise<LessonEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateLesson(id: number, data: LessonDTO): Promise<LessonEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteLesson(id: number): Promise<ResponseModel> {
    try {
      const rowEffected: number = (await this.delete({ id })).affected;
      if (rowEffected == 1)
        return {
          statusCode: HttpStatus.OK,
          message: CommonMessage.SUCCESS,
          data: { is_deleted: true },
        };

      return { statusCode: HttpStatus.OK, message: CommonMessage.DELETE_FAIL, data: { is_deleted: false } };
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
  public async getLengthLesson(): Promise<any> {
    try {
      const queryBuilder = this.count();
      return queryBuilder;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
