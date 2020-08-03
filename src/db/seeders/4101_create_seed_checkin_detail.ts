import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { CheckinDetailEntity } from '../entities/checkin-detail.entity';

export class Seeder4001KeyResult implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CheckinDetailEntity)
      .values([
        {
          valueObtained: 50,
          confidentLevel: 1,
          progress: '30',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 2,
          keyResultId: 1,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          progress: '40',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 1,
          keyResultId: 1,
        },
        {
          valueObtained: 40,
          confidentLevel: 1,
          progress: '31',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 2,
          keyResultId: 1,
        },
        {
          valueObtained: 10,
          confidentLevel: 1,
          progress: '20',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 1,
          keyResultId: 1,
        },
        {
          valueObtained: 50,
          confidentLevel: 1,
          progress: '30',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 3,
          keyResultId: 1,
        },
      ])
      .execute();
  }
}
