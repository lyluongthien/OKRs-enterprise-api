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
          checkinAt: '2020 / 10 / 12',
          nextCheckinDate: '2020 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 4,
        },
        {
          confidentLevel: 2,
          checkinAt: '2019 / 10 / 12',
          nextCheckinDate: '2019 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 3,
        },
        {
          confidentLevel: 2,
          checkinAt: '2018 / 10 / 12',
          nextCheckinDate: '2018 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 2,
          objectiveId: 2,
        },
        {
          confidentLevel: 1,
          checkinAt: '2020 / 10 / 12',
          nextCheckinDate: '2020 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 1,
        },
        {
          confidentLevel: 1,
          checkinAt: '2020 / 10 / 12',
          nextCheckinDate: '2020 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 4,
        },
        {
          confidentLevel: 2,
          checkinAt: '2019 / 10 / 12',
          nextCheckinDate: '2019 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 3,
        },
        {
          confidentLevel: 2,
          checkinAt: '2018 / 10 / 12',
          nextCheckinDate: '2018 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 2,
          objectiveId: 2,
        },
        {
          confidentLevel: 1,
          checkinAt: '2020 / 10 / 12',
          nextCheckinDate: '2020 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 1,
        },
        {
          confidentLevel: 1,
          checkinAt: '2020 / 10 / 12',
          nextCheckinDate: '2020 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 4,
        },
        {
          confidentLevel: 2,
          checkinAt: '2019 / 10 / 12',
          nextCheckinDate: '2019 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 3,
        },
        {
          confidentLevel: 2,
          checkinAt: '2018 / 10 / 12',
          nextCheckinDate: '2018 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 2,
          objectiveId: 2,
        },
        {
          confidentLevel: 1,
          checkinAt: '2020 / 10 / 12',
          nextCheckinDate: '2020 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 1,
        },
        {
          confidentLevel: 1,
          checkinAt: '2020 / 10 / 12',
          nextCheckinDate: '2020 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 4,
        },
        {
          confidentLevel: 2,
          checkinAt: '2019 / 10 / 12',
          nextCheckinDate: '2019 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 3,
        },
        {
          confidentLevel: 2,
          checkinAt: '2018 / 10 / 12',
          nextCheckinDate: '2018 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 2,
          objectiveId: 2,
        },
        {
          confidentLevel: 1,
          checkinAt: '2020 / 10 / 12',
          nextCheckinDate: '2020 / 10 / 17',
          status: CheckinStatus.DRAFT,
          teamLeaderId: 1,
          objectiveId: 1,
        },
      ])
      .execute();
  }
}
