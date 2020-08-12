import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import slugify from 'slugify';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';
import { LessonDTO } from './lesson.dto';
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

  public async getDetailLesson(slug: string): Promise<ResponseModel> {
    const data = await this._lessonRepository.getDetailLesson(slug);
    const listLesson = await this._lessonRepository.getOrderedLessons();
    if (!data) {
      throw new HttpException(CommonMessage.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    let nextLesson = null;
    let preLesson = null;
    // Get next and previous lesson
    listLesson.map((lesson, index, listLesson) => {
      const length = listLesson.length;
      if (lesson.id === data.id && index < length - 1) {
        nextLesson = listLesson[index + 1];
      }
      if (lesson.id === data.id && index > 0) {
        preLesson = listLesson[index - 1];
      }
    });

    const resData = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      index: data.index,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      nextLesson: nextLesson,
      preLesson: preLesson,
    };

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: resData,
    };
  }

  public async searchLessons(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._lessonRepository.searchLessons(text, options);
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
      index: lessons.index,
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
    const data = await this._lessonRepository.deleteLesson(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
