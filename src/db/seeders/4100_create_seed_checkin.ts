import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { CheckinEntity } from '../entities/checkin.entity';
// import { CheckinStatus } from '@app/constants/app.enums';

export class Seeder4001Checkin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CheckinEntity)
      .values([
        // {
        //   confidentLevel: 1,
        //   checkinAt: '2020/07/22',
        //   nextCheckinDate: '2020/07/29',
        //   status: CheckinStatus.DONE,
        //   teamLeaderId: 3,
        //   objectiveId: 11,
        // },
        // {
        //   confidentLevel: 1,
        //   checkinAt: '2020/07/29',
        //   nextCheckinDate: '2020/08/08',
        //   status: CheckinStatus.DRAFT,
        //   teamLeaderId: 3,
        //   objectiveId: 11,
        // },
        // {
        //   confidentLevel: 2,
        //   checkinAt: '2020/07/22',
        //   nextCheckinDate: '2020/07/29',
        //   status: CheckinStatus.DONE,
        //   teamLeaderId: 3,
        //   objectiveId: 12,
        // },
        // {
        //   confidentLevel: 2,
        //   checkinAt: '2020/07/11',
        //   nextCheckinDate: '2020/08/18',
        //   status: CheckinStatus.CLOSED,
        //   teamLeaderId: 2,
        //   objectiveId: 12,
        // },
        // {
        //   confidentLevel: 2,
        //   checkinAt: '2020/07/29',
        //   nextCheckinDate: '2020/08/08',
        //   status: CheckinStatus.PENDING,
        //   teamLeaderId: 3,
        //   objectiveId: 13,
        // },
        // {
        //   confidentLevel: 2,
        //   checkinAt: '2020/08/04',
        //   nextCheckinDate: '2020/08/18',
        //   status: CheckinStatus.DONE,
        //   teamLeaderId: 3,
        //   objectiveId: 14,
        // },
        // {
        //   confidentLevel: 3,
        //   checkinAt: '2020/08/11',
        //   nextCheckinDate: '2020/08/05',
        //   status: CheckinStatus.DONE,
        //   teamLeaderId: 3,
        //   objectiveId: 15,
        // },
        // {
        //   confidentLevel: 3,
        //   checkinAt: '2020/08/11',
        //   nextCheckinDate: '2020/08/18',
        //   status: CheckinStatus.DONE,
        //   teamLeaderId: 3,
        //   objectiveId: 16,
        // },
        // {
        //   confidentLevel: 3,
        //   checkinAt: '2020/07/22',
        //   nextCheckinDate: '2020/07/29',
        //   status: CheckinStatus.DONE,
        //   teamLeaderId: 14,
        //   objectiveId: 2,
        // },
        // {
        //   confidentLevel: 3,
        //   checkinAt: '2020/08/11',
        //   nextCheckinDate: '2020/08/18',
        //   status: CheckinStatus.DRAFT,
        //   teamLeaderId: 14,
        //   objectiveId: 2,
        // },
        // {
        //   confidentLevel: 3,
        //   checkinAt: '2020/08/11',
        //   nextCheckinDate: '2020/08/18',
        //   status: CheckinStatus.DONE,
        //   teamLeaderId: 14,
        //   objectiveId: 3,
        // },
        // {
        //   confidentLevel: 3,
        //   checkinAt: '2020/08/11',
        //   nextCheckinDate: '2020/08/18',
        //   status: CheckinStatus.DRAFT,
        //   teamLeaderId: 14,
        //   objectiveId: 6,
        // },
        // {
        //   confidentLevel: 3,
        //   checkinAt: '2020/08/11',
        //   nextCheckinDate: '2020/08/18',
        //   status: CheckinStatus.DONE,
        //   teamLeaderId: 14,
        //   objectiveId: 6,
        // },
      ])
      .execute();
  }
}
