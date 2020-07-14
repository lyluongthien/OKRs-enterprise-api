import { Injectable, HttpStatus } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';
import { LessonDTO } from './lesson.dto';
import slugify from 'slugify';
import { generate } from 'generate-password';

@Injectable()
export class LessonService {
  constructor(private _lessonRepository: LessonRepository) {}

  public async getLessons(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._lessonRepository.getLessons(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createLesson(lessons: LessonDTO): Promise<ResponseModel> {
    const token = generate({ length: 10, numbers: true, lowercase: true, uppercase: true });
    const slug = slugify(lessons.title) + `-${token}`;
    await this._lessonRepository.createLesson({
      title: lessons.title,
      content: lessons.content,
      slug: slug,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }

  public async updateLesson(id: number, lessons: LessonDTO): Promise<ResponseModel> {
    if (lessons.title) {
      const token = generate({ length: 10, numbers: true, lowercase: true, uppercase: true });
      const slug = slugify(lessons.title) + `-${token}`;
      lessons.slug = slug;
    }

    await this._lessonRepository.updateLesson(id, lessons);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }
  public async deleteLesson(id: number): Promise<ResponseModel> {
    await this._lessonRepository.deleteLesson(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {},
    };
  }

  public async searchLessons(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = this._lessonRepository.searchLessons(text, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: this._lessonRepository.searchLessons(text, options),
    };
  }
}
