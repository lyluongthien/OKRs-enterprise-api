import { Repository, EntityRepository, ObjectLiteral, FindOneOptions } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

import { UserEntity } from '@app/db/entities/user.entity';
import { RegisterDTO } from '../auth/auth.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { UserDTO, UserProfileDTO } from './user.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async getList(): Promise<UserEntity[]> {
    return await this.find();
  }

  public async getUserByConditions(id?: number, options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return await this.findOneOrFail(id, options);
  }

  public async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.findOne({ where: { email } });
  }

  public async updateUserById(id: number, user: RegisterDTO): Promise<UserEntity> {
    await this.update({ id }, user);
    return this.getUserByConditions(id);
  }

  public async deleteUser(id: number): Promise<ObjectLiteral> {
    try {
      const rowEffected: number = await (await this.delete({ id })).affected;
      return { isDeleted: rowEffected === 1 ? true : false };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getUsers(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'roles')
      .leftJoinAndSelect('user.jobPosition', 'jobPositions')
      .leftJoinAndSelect('user.team', 'teams');
    return await paginate<UserEntity>(queryBuilder, options);
  }

  public async getUserDetail(id: number): Promise<UserEntity> {
    return await this.findOneOrFail({
      relations: ['role', 'jobPosition'],
      where: { id },
    });
  }

  public async updateUserProfile(id: number, data: UserProfileDTO): Promise<UserEntity> {
    await this.update({ id }, data);
    return await this.findOne({ id });
  }
  //HR
  public async updateUserInfor(id: number, data: UserDTO): Promise<UserEntity> {
    await this.update({ id }, data);
    return await this.findOne({ id });
  }

  public async getUserRole(id: number): Promise<UserEntity> {
    return await this.findOneOrFail({
      relations: ['role'],
      where: { id },
    });
  }
}
