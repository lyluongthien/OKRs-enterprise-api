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
          gender: true,
          gravatarURL: generateGravatar('ducpvse05320@fpt.edu.vn'),
          jobPositionId: 1,
          roleId: 2,
          teamId: 3,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'ducnmhe130666@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Ngô Minh Đức',
          gender: true,
          gravatarURL: generateGravatar('ducnmhe130666@fpt.edu.vn'),
          jobPositionId: 2,
          roleId: 2,
          teamId: 3,
          isActive: true,
          isApproved: true,
          isLeader: true,
        },
        {
          email: 'hiepdqse05627@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Đỗ Quang Hiệp',
          gender: true,
          gravatarURL: generateGravatar('ducnmhe130666@fpt.edu.vn'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: true,
        },
        {
          email: 'phanduc0908@gmail.com',
          password: hashSync(seedPassword, _salt),
          fullName: 'Phan Quang Đức',
          gender: true,
          gravatarURL: generateGravatar('phanduc0908@gmail.com'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: false,
          isLeader: false,
        },
        {
          email: 'oaissaas.jijeli199x@carazfi.cf',
          password: hashSync(seedPassword, _salt),
          fullName: 'Nguyễn Anh Huy',
          gender: true,
          gravatarURL: generateGravatar('oaissaas.jijeli199x@carazfi.cf'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: false,
          isLeader: false,
        },
        {
          email: 'oaissa.jijeli199x@carazfi.cf',
          password: hashSync(seedPassword, _salt),
          fullName: 'Nguyễn Anh Huy',
          gender: false,
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
          gender: true,
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
          gender: true,
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
          gender: true,
          gravatarURL: generateGravatar('yuarivalskyf@misworkbar.ga'),
          jobPositionId: 2,
          roleId: 3,
          teamId: 3,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'jpprivalskyf@misworkbar.ga',
          password: hashSync(seedPassword, _salt),
          fullName: 'Trần Tất Thắng',
          gender: true,
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
          gender: false,
          gravatarURL: generateGravatar('qaprivalskyf@misworkbar.ga'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 3,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'ashhasdbiuasd@misworkbar.ga',
          password: hashSync(seedPassword, _salt),
          fullName: 'Đoàn Đức Hiếu',
          gender: true,
          gravatarURL: generateGravatar('ashhasdbiuasd@misworkbar.ga'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 3,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'nhattqse05439@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Trần Quang Nhật',
          gender: true,
          gravatarURL: generateGravatar('nhattqse05439@fpt.edu.vn'),
          jobPositionId: 3,
          roleId: 3,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'quangnvse05839@fpt.edu.vn',
          password: hashSync(seedPassword, _salt),
          fullName: 'Nguyễn Văn Quang',
          gender: true,
          gravatarURL: generateGravatar('quangnvse05839@fpt.edu.vn'),
          jobPositionId: 1,
          roleId: 1,
          teamId: 4,
          isActive: true,
          isApproved: true,
          isLeader: true,
        },
        {
          email: 'hoapn@gmail.com',
          password: hashSync(seedPassword, _salt),
          fullName: 'Phạm Ngọc Hòa',
          gender: true,
          gravatarURL: generateGravatar('hoapn@gmail.com'),
          jobPositionId: 1,
          roleId: 2,
          teamId: 2,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
        {
          email: 'hoapn1@gmail.com',
          password: hashSync(seedPassword, _salt),
          fullName: 'Phạm Hồng Hà',
          gender: true,
          gravatarURL: generateGravatar('hoapn1@gmail.com'),
          jobPositionId: 1,
          roleId: 3,
          teamId: 1,
          isActive: true,
          isApproved: true,
          isLeader: true,
        },
        {
          email: 'hoapn2@gmail.com',
          password: hashSync(seedPassword, _salt),
          fullName: 'Phạm Hồng Thủy',
          gender: true,
          gravatarURL: generateGravatar('hoapn2@gmail.com'),
          jobPositionId: 1,
          roleId: 3,
          teamId: 1,
          isActive: true,
          isApproved: true,
          isLeader: false,
        },
      ])
      .execute();
  }
}
