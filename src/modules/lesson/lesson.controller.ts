import { Controller, Get, Query, Put, Post, Param, Body, Delete, UseGuards } from '@nestjs/common';

import { LessonService } from './lesson.service';
import { ResponseModel } from '@app/constants/app.interface';
import { LessonDTO } from './lesson.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { RoleEnum } from '@app/constants/app.enums';
import { Roles } from '../role/role.decorator';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';

@Controller('/api/v1/lessons')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class LessonController {
  constructor(private _lessonService: LessonService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public getLessons(@Query('text') text: string): Promise<ResponseModel> {
    if (text) {
      return this._lessonService.searchLessons(text);
    }
    return this._lessonService.getLessons();
  }

  @Get(':slug')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public getLessonDetail(@Param('slug') slug: string): Promise<ResponseModel> {
    return this._lessonService.getDetailLesson(slug);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public createLesson(@Body() lesson: LessonDTO): Promise<ResponseModel> {
    return this._lessonService.createLesson(lesson);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public updateLesson(@Param('id') id: number, @Body() data: LessonDTO): Promise<ResponseModel> {
    return this._lessonService.updateLesson(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public deteleLesson(@Param('id') id: number): Promise<ResponseModel> {
    return this._lessonService.deleteLesson(id);
  }
}
