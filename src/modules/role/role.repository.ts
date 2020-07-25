import { RoleEntity } from '@app/db/entities/role.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CommonMessage } from '@app/constants/app.enums';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {
  public async getListRoles(): Promise<RoleEntity[]> {
    try {
      return await this.createQueryBuilder('role').getMany();
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
