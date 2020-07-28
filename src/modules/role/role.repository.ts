import { RoleEntity } from '@app/db/entities/role.entity';
import { Repository, EntityRepository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {
  public async getListRoles(): Promise<RoleEntity[]> {
    try {
      return await this.createQueryBuilder('role').getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getRoleByName(name: string): Promise<RoleEntity> {
    try {
      return await this.findOne({ where: { name } });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
