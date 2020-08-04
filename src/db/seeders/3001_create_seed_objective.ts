import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { ObjectiveEntity } from '../entities/objective.entity';

export class Seeder3001bjective implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(ObjectiveEntity)
      .values([
        {
          title: 'Đạt doanh thu 400.000.000 Đ trong quý tới',
          progress: 0,
          userId: 1,
          isRootObjective: true,
          cycleId: 1,
        },
        {
          title: 'Mua xe ô tô Vinfast LUX SA 2.0',
          progress: 0,
          userId: 1,
          isRootObjective: false,
          cycleId: 2,
          alignObjectivesId: [1, 4],
        },
        {
          title: 'Ký kết được 15 hợp đồng với khách hàng',
          progress: 0,
          userId: 2,
          isRootObjective: false,
          cycleId: 2,
        },
        {
          title: 'Hoàn thành 100% thiết kế sự án HLE',
          progress: 0,
          userId: 3,
          isRootObjective: false,
          cycleId: 2,
        },
        {
          title: 'Đạt được số liệu kỉ lục trong tất cả các lĩnh vực của Marketing',
          progress: 0,
          userId: 14,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 1,
        },
        {
          title: 'Triển khai newsletter hàng tuần thành công',
          progress: 0,
          userId: 2,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 5,
        },
        {
          title: 'Cải thiện các chỉ số trong quy trình bán hàng',
          progress: 0,
          userId: 9,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 6,
        },
        {
          title: 'Hiểu khách hàng và phân tích hành vi khách hàng',
          progress: 0,
          userId: 11,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 7,
        },
        {
          title: 'Đạt được doanh thu kỉ lục',
          progress: 0,
          userId: 12,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 7,
        },
      ])
      .execute();
  }
}
