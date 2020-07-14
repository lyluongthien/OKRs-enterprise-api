import { Controller, Get } from '@nestjs/common';
import { LessonService } from './lesson.service';

@Controller('/api/v1/lessons')
export class LessonController {
  constructor(private _lesson_Service: LessonService) {}
}
