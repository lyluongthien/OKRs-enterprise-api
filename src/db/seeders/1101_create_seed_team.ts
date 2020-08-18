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
          description: 'Phát triển kế hoạch kinh doanh cho công ty.',
        },
        {
          name: 'Phòng công nghệ',
          description: 'Phát triển công nghệ.',
        },
        {
          name: 'Phòng thiết kế',
          description: 'Thiết kế sản phẩm.',
        },
      ])
      .execute();
  }
}
