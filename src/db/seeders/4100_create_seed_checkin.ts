import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { CheckinEntity } from '../entities/checkin.entity';
import { CheckinStatus } from '@app/constants/app.enums';

export class Seeder4001KeyResult implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CheckinEntity)
      .values([
        {
          confidentLevel: 1,
          checkinAt: '2020 / 08 / 04',
          nextCheckinDate: '2020 / 08 / 11',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 9,
          objectiveId: 8,
        },
        {
          confidentLevel: 2,
          checkinAt: '2020 / 08 / 11',
          nextCheckinDate: '2020 / 08 / 18',
          status: CheckinStatus.DONE,
          teamLeaderId: 9,
          objectiveId: 8,
        },
        {
          confidentLevel: 2,
          checkinAt: '2020 / 08 / 04',
          nextCheckinDate: '2020 / 08 / 11',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 9,
          objectiveId: 9,
        },
        {
          confidentLevel: 3,
          checkinAt: '2020 / 08 / 11',
          nextCheckinDate: '2020 / 08 / 18',
          status: CheckinStatus.DONE,
          teamLeaderId: 9,
          objectiveId: 9,
        },
      ])
      .execute();
  }
}
