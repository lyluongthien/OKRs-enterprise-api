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
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 1,
          keyResultId: 14,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 1,
          keyResultId: 15,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 1,
          keyResultId: 16,
        },
        {
          valueObtained: 60,
          confidentLevel: 1,
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 2,
          keyResultId: 14,
        },
        {
          valueObtained: 30,
          confidentLevel: 1,
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 2,
          keyResultId: 15,
        },
        {
          valueObtained: 40,
          confidentLevel: 1,
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 2,
          keyResultId: 16,
        },
        {
          valueObtained: 10,
          confidentLevel: 1,
          problems: 'Gap nhieu van de',
          plans: 'khong co',
          checkinId: 3,
          keyResultId: 17,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          problems: 'Gap mot so tro ngai',
          plans: 'khong co',
          checkinId: 3,
          keyResultId: 18,
        },
        {
          valueObtained: 50,
          confidentLevel: 1,
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 3,
          keyResultId: 19,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          problems: 'Gap nhieu van de',
          plans: 'khong co',
          checkinId: 4,
          keyResultId: 17,
        },
        {
          valueObtained: 30,
          confidentLevel: 1,
          problems: 'Gap mot so tro ngai',
          plans: 'khong co',
          checkinId: 4,
          keyResultId: 18,
        },
        {
          valueObtained: 60,
          confidentLevel: 1,
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 4,
          keyResultId: 19,
        },
      ])
      .execute();
  }
}
