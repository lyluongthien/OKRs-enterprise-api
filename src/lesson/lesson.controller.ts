import { Controller, Get, Query, Put, Post, Param, Body, Delete } from '@nestjs/common';

import { LessonService } from './lesson.service';
import { ResponseModel } from '@app/constants/app.interface';
import { LessonDTO } from './lesson.dto';

@Controller('/api/v1/lessons')
export class LessonController {
  constructor(private _lessonService: LessonService) {}

  @Get()
  public getLessons(): Promise<ResponseModel> {
    return this._lessonService.getLessons();
  }

  @Get('/search')
  public searchLessons(@Query('text') text: string): Promise<ResponseModel> {
    return this._lessonService.searchLessons(text);
  }

  @Get(':slug')
  public getDetailLesson(@Param('slug') slug: string): Promise<ResponseModel> {
    return this._lessonService.getDetailLesson(slug);
  }

  @Post()
  public createLesson(@Body() lesson: LessonDTO): Promise<ResponseModel> {
    return this._lessonService.createLesson(lesson);
  }

  @Put(':id')
  public updateLesson(@Param('id') id: number, @Body() data: LessonDTO): Promise<ResponseModel> {
    return this._lessonService.updateLesson(id, data);
  }

  @Delete(':id')
  public deteleLesson(@Param('id') id: number): any {
    return this._lessonService.deleteLesson(id);
  }
}
