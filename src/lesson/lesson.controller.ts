import { Controller, Get, Query, Put, Post, Param, Body, Delete } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { currentPage, limitPagination } from '@app/constants/app.magic-number';
import { ResponseModel } from '@app/constants/app.interface';
import { LessonDTO } from './lesson.dto';
import { LessonEntity } from '@app/db/entities/lesson.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('/api/v1/lessons')
export class LessonController {
  constructor(private _lesson_Service: LessonService) {}

  @Get()
  public async getLessons(@Query('page') page: number, @Query('limit') limit: number): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._lesson_Service.getLessons({
      page,
      limit,
      route: '',
    });
  }

  @Get('/search')
  public async searchLessons(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._lesson_Service.searchLessons(text, {
      page,
      limit,
      route: '',
    });
  }
  @Post()
  public createLesson(@Body() lesson: LessonDTO): Promise<ResponseModel> {
    return this._lesson_Service.createLesson(lesson);
  }

  @Put(':id')
  public updateLesson(@Param('id') id: number, @Body() data: LessonDTO): Promise<ResponseModel> {
    return this._lesson_Service.updateLesson(id, data);
  }

  @Delete(':id')
  public deteleLesson(@Param('id') id: number): any {
    return this._lesson_Service.deleteLesson(id);
  }
}
