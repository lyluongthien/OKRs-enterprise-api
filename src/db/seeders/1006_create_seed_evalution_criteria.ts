import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { EvaluationCriteriaEntity } from '../entities/evaluation-criteria.entity';
import { EvaluationCriteriaEnum } from '@app/constants/app.enums';

export class Seeder1006EvaluationCriteria implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(EvaluationCriteriaEntity)
      .values([
        { content: 'Bạn cần cố gắng hơn nữa', numberOfStar: 1, type: EvaluationCriteriaEnum.LEADER_TO_MEMBER },
        { content: 'Bạn đang có sự tiến bộ', numberOfStar: 2, type: EvaluationCriteriaEnum.LEADER_TO_MEMBER },
        {
          content: 'Bạn làm việc tốt',
          numberOfStar: 3,
          type: EvaluationCriteriaEnum.LEADER_TO_MEMBER,
        },
        {
          content: 'Tôi hài lòng với công việc của bạn',
          numberOfStar: 5,
          type: EvaluationCriteriaEnum.LEADER_TO_MEMBER,
        },
        {
          content: 'Bạn là người cố vấn tuyệt vời',
          numberOfStar: 5,
          type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        },
        {
          content: 'Những góp ý của ban rất có ích với tôi',
          numberOfStar: 4,
          type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        },
        {
          content: 'Bạn là nhà quản lý biết lắng nghe',
          numberOfStar: 4,
          type: EvaluationCriteriaEnum.MEMBER_TO_LEADER,
        },
        {
          content: 'Vượt mong đợi',
          numberOfStar: 50,
          type: EvaluationCriteriaEnum.RECOGNITION,
        },
        {
          content: 'Nỗ lực',
          numberOfStar: 30,
          type: EvaluationCriteriaEnum.RECOGNITION,
        },
        {
          content: 'Hoàn thành tốt',
          numberOfStar: 10,
          type: EvaluationCriteriaEnum.RECOGNITION,
        },
      ])
      .execute();
  }
}
