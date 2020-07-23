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
        {
          email: 'phanduc0908@gmail.com',
          password: hashSync(seedPassword, _salt),
          fullName: 'Phan Quang Đức',
          gravatarURL: generateGravatar('phanduc0908@gmail.com'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'oaissaas.jijeli199x@carazfi.cf',
          password: hashSync(seedPassword, _salt),
          fullName: 'Nguyễn Anh Huy',
          gravatarURL: generateGravatar('oaissaas.jijeli199x@carazfi.cf'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'oaissa.jijeli199x@carazfi.cf',
          password: hashSync(seedPassword, _salt),
          fullName: 'Nguyễn Anh Huy',
          gravatarURL: generateGravatar('oaissa.jijeli199x@carazfi.cf'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'mktrivalskyf@misworkbar.ga',
          password: hashSync(seedPassword, _salt),
          fullName: 'Đồng Quang Huy',
          gravatarURL: generateGravatar('mktrivalskyf@misworkbar.ga'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'aoerivalskyf@misworkbar.ga',
          password: hashSync(seedPassword, _salt),
          fullName: 'Nguyễn Nhất Long',
          gravatarURL: generateGravatar('aoerivalskyf@misworkbar.ga'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'yuarivalskyf@misworkbar.ga',
          password: hashSync(seedPassword, _salt),
          fullName: 'Lê Hữu Lợi',
          gravatarURL: generateGravatar('yuarivalskyf@misworkbar.ga'),
          jobPositionId: 2,
          roleId: 3,
          teamId: 3,
          isActive: false,
          isApproved: false,
          isLeader: false,
        },
        {
          email: 'jpprivalskyf@misworkbar.ga',
          password: hashSync(seedPassword, _salt),
          fullName: 'Trần Tất Thắng',
          gravatarURL: generateGravatar('jpprivalskyf@misworkbar.ga'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'qaprivalskyf@misworkbar.ga',
          password: hashSync(seedPassword, _salt),
          fullName: 'Trần Hồng Diệu Linh',
          gravatarURL: generateGravatar('qaprivalskyf@misworkbar.ga'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'ashhasdbiuasd@misworkbar.ga',
          password: hashSync(seedPassword, _salt),
          fullName: '	Đoàn Đức Hiếu',
          gravatarURL: generateGravatar('ashhasdbiuasd@misworkbar.ga'),
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
