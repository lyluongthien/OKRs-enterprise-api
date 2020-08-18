import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserStarEntity } from '../entities/user-stars.entity';

export class Seeder2002UserStar implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserStarEntity)
      .values([
        // { star: 5, cycleId: 1, userId: 1 },
        // { star: 4, cycleId: 1, userId: 2 },
        // { star: 2, cycleId: 1, userId: 1 },
        // { star: 5, cycleId: 1, userId: 3 },
        // { star: 5, cycleId: 2, userId: 3 },
      ])
      .execute();
  }
}
