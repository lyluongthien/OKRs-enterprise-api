import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { JobEntity } from '../entities/job.entity';

export class TeamSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(JobEntity)
      .values([{ name: 'Phòng kinh doanh' }, { name: 'Team sói già' }, { name: 'Olympus teams' }])
      .execute();
  }
}
