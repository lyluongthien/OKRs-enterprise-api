import { EntityRepository, Repository, ObjectLiteral } from 'typeorm';
import { Pagination, paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { LessonEntity } from '@app/db/entities/lesson.entity';

@EntityRepository(LessonEntity)
export class LessonRepository extends Repository<LessonEntity> {
  public async getLessons(options: IPaginationOptions): Promise<Pagination<LessonEntity>> {
    const queryBuilder = this.createQueryBuilder('lesson');
    return await paginate<LessonEntity>(queryBuilder, options);
  }
}
