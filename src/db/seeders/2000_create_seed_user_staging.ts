import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { UserEntity } from '../entities/user.entity';
import accessEnv from '@app/libs/accessEnv';
import { _salt } from '@app/constants/app.config';
import { generateGravatar } from '@app/libs/gravatar';

export class Seeder2000UserStaging implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const seedPassword: string = accessEnv('SEED_PASSSWORD');
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          email: 'ducpvse@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Phan Văn Đức',
          gender: true,
          gravatarURL: generateGravatar('ducpvse@fpt.edu.vn'),
          jobPositionId: 1,
          roleId: 3,
          teamId: 3,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'quangnvse@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Nguyễn Văn Quang',
          gender: true,
          gravatarURL: generateGravatar('quangnvse@fpt.edu.vn'),
          jobPositionId: 1,
          roleId: 3,
          teamId: 3,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
      ])
      .execute();
  }
}
