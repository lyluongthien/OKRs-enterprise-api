import { Repository, EntityRepository, ObjectLiteral, FindOneOptions } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

import { UserEntity } from '@app/db/entities/user.entity';
import { RegisterDTO } from '../auth/auth.dto';
import { UserDTO, UserProfileDTO, ResetPasswordTokenDTO, ChangePasswordDTO } from './user.dto';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async getList(): Promise<UserEntity[]> {
    return await this.find();
  }

  public async getUserByConditions(id?: number, options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
    try {
      return await this.findOne(id, options);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
      if (rowEffected == 1)
        return {
          statusCode: HttpStatus.OK,
          message: CommonMessage.SUCCESS,
          data: { is_deleted: true },
        };
      return { statusCode: HttpStatus.OK, message: CommonMessage.DELETE_FAIL, data: { is_deleted: false } };
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUsers(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoinAndSelect('user.jobPosition', 'jobPositions')
        .leftJoinAndSelect('user.team', 'teams');
      return await paginate<UserEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async searchUsers(text: string, options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'roles')
      .leftJoinAndSelect('user.jobPosition', 'jobPositions')
      .leftJoinAndSelect('user.team', 'teams')
      .where('user.fullName like :text', { text: '%' + text + '%' })
      .orWhere('user.email like :text', { text: '%' + text + '%' })
      .orderBy('user.id', 'ASC');

    return await paginate<UserEntity>(queryBuilder, options);
  }

  public async getUserDetail(id: number): Promise<UserEntity> {
    return await this.findOneOrFail({
      relations: ['role', 'jobPosition', 'team'],
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

  public async updateResetPasswordToken(email: string, data: ResetPasswordTokenDTO): Promise<UserEntity> {
    try {
      await this.update({ email }, data);
      return await this.findOne({ email });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUserByResetPasswordToken(token: string): Promise<UserEntity> {
    try {
      return await this.findOne({ where: { resetPasswordToken: token } });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async updatePassword(id: number, data: ChangePasswordDTO): Promise<void> {
    try {
      await this.update({ id }, data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
