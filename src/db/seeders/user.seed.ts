import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

export class UserSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        { email: 'admin@gmail.com', password: 'adminpasword@123', fullName: 'Phan Văn Đức' },
        { email: 'hr@gmail.com', password: 'hrpassword@123', fullName: 'Ngô Minh Đức' },
      ])
      .execute();
  }
}
