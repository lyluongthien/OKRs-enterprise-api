import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { RoleEntity } from '@app/db/entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RoleEntity, RoleRepository])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
