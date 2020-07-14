import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { TemplateCheckinEntity } from '../entities/template-checkin.entity';

export class Seeder1003TemplateCheckin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(TemplateCheckinEntity)
      .values([{ name: 'PPP(Plans, Progress, Problems)' }])
      .execute();
  }
}
