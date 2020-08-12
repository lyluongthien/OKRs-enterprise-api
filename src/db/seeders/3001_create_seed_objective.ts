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
          cycleId: 3,
        },
        {
          title: 'Mua xe ô tô Vinfast LUX SA 2.0',
          progress: 0,
          userId: 3,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 1,
          alignObjectivesId: [1, 4],
        },
        {
          title: 'Ký kết được 15 hợp đồng với khách hàng',
          progress: 0,
          userId: 3,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 6,
        },
        {
          title: 'Hoàn thành 100% thiết kế sự án HLE',
          progress: 0,
          userId: 9,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 6,
        },
        {
          title: 'Đạt doanh thu định kỳ hàng tháng (MRR) là $ 250000',
          progress: 0,
          userId: 9,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 1,
        },
        {
          title: 'Đạt được số liệu kỉ lục trong tất cả các lĩnh vực của Marketing',
          progress: 0,
          userId: 14,
          isRootObjective: true,
          cycleId: 3,
        },
        {
          title: 'Triển khai newsletter hàng tuần thành công',
          progress: 0,
          userId: 4,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 2,
        },
        {
          title: 'Cải thiện sự gắn kết nhân viên nội bộ và sự hài lòng trong công việc',
          progress: 43,
          userId: 4,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 3,
        },
        {
          title: 'Chiến lược tuyển dụng kĩ sư',
          progress: 36,
          userId: 5,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 2,
        },
        {
          title: 'Làm rõ và thúc đẩy văn hoá và các giá trị của công ty',
          progress: 0,
          userId: 5,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 3,
        },
        {
          title: 'Cải thiện các chỉ số trong quy trình bán hàng',
          progress: 0,
          userId: 13,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 4,
        },
        {
          title: 'Hiểu khách hàng và phân tích hành vi khách hàng',
          progress: 0,
          userId: 13,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 5,
        },
        {
          title: 'Du lịch 15 nước ở Châu Âu',
          progress: 0,
          userId: 13,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 5,
        },
        {
          title: 'Thám hiểm mặt trăng',
          progress: 0,
          userId: 13,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 5,
        },
        {
          title: 'Thành thạo 15 ngôn ngữ lập trình',
          progress: 0,
          userId: 13,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 5,
        },
        {
          title: 'Mua nhà ở VinHome RiverSide',
          progress: 0,
          userId: 13,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 5,
          isCompleted: true,
        },
        {
          title: 'Cải thiện tài liệu quản trị nội bộ',
          progress: 0,
          userId: 14,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 4,
        },
        {
          title: 'Cải thiện sự hài lòng với công việc lễ tân',
          progress: 0,
          userId: 14,
          isRootObjective: false,
          cycleId: 3,
          parentObjectiveId: 5,
        },
      ])
      .execute();
  }
}
