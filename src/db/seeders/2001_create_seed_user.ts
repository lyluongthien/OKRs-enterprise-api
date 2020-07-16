import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { UserEntity } from '../entities/user.entity';
import accessEnv from '@app/libs/accessEnv';
import { _salt } from '@app/constants/app.config';
import { generateGravatar } from '@app/libs/gravatar';

export class Seeder2001User implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const seedPassword: string = accessEnv('SEED_PASSSWORD');
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          email: 'ducpvse05320@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Phan Văn Đức',
          gravatarURL: generateGravatar('ducpvse05320@fpt.edu.vn'),
          jobPositionId: 1,
          roleId: 1,
          teamId: 1,
          isActive: true,
          isApproved: true,
          isLeader: true,
        },
        {
          email: 'ducnmhe130666@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Ngô Minh Đức',
          gravatarURL: generateGravatar('ducnmhe130666@fpt.edu.vn'),
          jobPositionId: 2,
          roleId: 2,
          teamId: 1,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'hiepdqse05627@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Đỗ Quang Hiệp',
          gravatarURL: generateGravatar('ducnmhe130666@fpt.edu.vn'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
      ])
      .execute();
  }
}
