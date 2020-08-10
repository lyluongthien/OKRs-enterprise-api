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
          progress: 'Được một nửa',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 1,
          keyResultId: 23,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          progress: 'Chưa được nhiều',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 1,
          keyResultId: 24,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 1,
          keyResultId: 25,
        },
        {
          valueObtained: 60,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 2,
          keyResultId: 26,
        },
        {
          valueObtained: 30,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 2,
          keyResultId: 27,
        },
        {
          valueObtained: 40,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 2,
          keyResultId: 28,
        },
        {
          valueObtained: 10,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Gap nhieu van de',
          plans: 'khong co',
          checkinId: 3,
          keyResultId: 29,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Gap mot so tro ngai',
          plans: 'khong co',
          checkinId: 3,
          keyResultId: 30,
        },
        {
          valueObtained: 50,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 3,
          keyResultId: 31,
        },
        {
          valueObtained: 20,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Gap nhieu van de',
          plans: 'khong co',
          checkinId: 4,
          keyResultId: 32,
        },
        {
          valueObtained: 30,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Gap mot so tro ngai',
          plans: 'khong co',
          checkinId: 4,
          keyResultId: 33,
        },
        {
          valueObtained: 60,
          confidentLevel: 1,
          progress: 'Được một nửa',
          problems: 'Khong co gi',
          plans: 'khong co',
          checkinId: 4,
          keyResultId: 34,
        },
      ])
      .execute();
  }
}
