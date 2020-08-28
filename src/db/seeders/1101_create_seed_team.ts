import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { TeamEntity } from '../entities/team.entity';

export class Seeder1101Team implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(TeamEntity)
      .values([
        {
          name: 'Phòng kinh doanh',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
          name: 'Phòng công nghệ',
          description: 'Lorem Ipsum is simply dummy text.',
        },
        {
          name: 'Phòng thiết kế',
          description: 'Lorem Ipsum is simply dummy text.',
        },
        {
          name: 'Chair Team',
          description: 'Lorem Ipsum is simply dummy text.',
        },
      ])
      .execute();
  }
}
