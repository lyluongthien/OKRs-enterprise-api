import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { hashSync } from 'bcryptjs';
import accessEnv from '@app/libs/accessEnv';
import { _salt } from '@app/constants/app.config';

export class UserSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const seedPassword: string = accessEnv('SEED_PASSSWORD');
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          email: 'ducpvse05320@fpt.edu.vn',
          _salt: _salt,
          password: hashSync(seedPassword, _salt),
          fullName: 'Phan Văn Đức',
        },
        {
          email: 'ducnmhe130666@fpt.edu.vn',
          _salt: _salt,
          password: hashSync(seedPassword, _salt),
          fullName: 'Ngô Minh Đức',
        },
        {
          email: 'hiepdqse05627@fpt.edu.vn',
          _salt: _salt,
          password: hashSync(seedPassword, _salt),
          fullName: 'Đỗ Quang Hiệp',
        },
      ])
      .execute();
  }
}
