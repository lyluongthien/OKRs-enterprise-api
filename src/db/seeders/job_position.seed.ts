import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { JobEntity } from '../entities/job.entity';

export class JobPositionSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(JobEntity)
      .values([
        { name: 'CEO' },
        { name: 'Trưởng phòng kinh doanh' },
        { name: 'Kế toán' },
        { name: 'Nhân viên thiết kế' },
      ])
      .execute();
  }
}
