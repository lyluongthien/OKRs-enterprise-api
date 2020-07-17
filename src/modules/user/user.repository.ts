import { Repository, EntityRepository, ObjectLiteral, FindOneOptions } from 'typeorm';
import { InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

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
      return { isDeleted: rowEffected === 1 ? true : false };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async getUsersActived(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select(['user.id', 'user.email', 'user.fullName', 'user.isLeader', 'user.isApproved', 'user.isActive'])
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoinAndSelect('user.jobPosition', 'jobPositions')
        .leftJoinAndSelect('user.team', 'teams')
        .where('user.isActive = true and user.isApproved = true');
      return await paginate<UserEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUsersApproved(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select(['user.id', 'user.email', 'user.fullName', 'user.isLeader', 'user.isApproved', 'user.isActive'])
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoinAndSelect('user.jobPosition', 'jobPositions')
        .leftJoinAndSelect('user.team', 'teams')
        .where('user.isApproved = false');
      return await paginate<UserEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUsersDeactived(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select(['user.id', 'user.email', 'user.fullName', 'user.isLeader', 'user.isApproved', 'user.isActive'])
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoinAndSelect('user.jobPosition', 'jobPositions')
        .leftJoinAndSelect('user.team', 'teams')
        .where('user.isActive = false');
      return await paginate<UserEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async searchUsersActived(text: string, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.fullName',
          'user.isLeader',
          'user.isApproved',
          'user.isActive',
          'jobPositions.id',
          'jobPositions.name',
          'teams.id',
          'teams.name',
        ])
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoin('user.jobPosition', 'jobPositions')
        .leftJoin('user.team', 'teams')
        .where('user.isActive = true')
        .andWhere('user.isApproved = true')
        .andWhere('(user.fullName like :text or user.email like :text2)', {
          text: '%' + text + '%',
          text2: '%' + text + '%',
        })
        .orderBy('user.id', 'ASC');
      return await paginate<UserEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async searchUsersApproved(text: string, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.fullName',
          'user.isLeader',
          'user.isApproved',
          'user.isActive',
          'jobPositions.id',
          'jobPositions.name',
          'teams.id',
          'teams.name',
        ])
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoin('user.jobPosition', 'jobPositions')
        .leftJoin('user.team', 'teams')
        .where('user.isApproved = false')
        .andWhere('(user.fullName like :text or user.email like :text2)', {
          text: '%' + text + '%',
          text2: '%' + text + '%',
        })
        .orderBy('user.id', 'ASC');
      return await paginate<UserEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async searchUsersDeactived(text: string, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.fullName',
          'user.isLeader',
          'user.isApproved',
          'user.isActive',
          'jobPositions.id',
          'jobPositions.name',
          'teams.id',
          'teams.name',
        ])
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoin('user.jobPosition', 'jobPositions')
        .leftJoin('user.team', 'teams')
        .where('user.isActive = false')
        .andWhere('(user.fullName like :text or user.email like :text2)', {
          text: '%' + text + '%',
          text2: '%' + text + '%',
        })
        .orderBy('user.id', 'ASC');
      return await paginate<UserEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUserByID(id: number): Promise<UserEntity> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.fullName',
          'user.isLeader',
          'user.isApproved',
          'user.isActive',
          'roles.name',
          'jobPositions.id',
          'jobPositions.name',
          'teams.id',
          'teams.name',
        ])
        .leftJoin('user.role', 'roles')
        .leftJoin('user.jobPosition', 'jobPositions')
        .leftJoin('user.team', 'teams')
        .where('user.id = :id', { id: id })
        .getOne();
      return await queryBuilder;
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.fullName',
          'user.isLeader',
          'user.isApproved',
          'user.isActive',
          'roles.name',
          'jobPositions.id',
          'jobPositions.name',
          'teams.id',
          'teams.name',
        ])
        .leftJoin('user.role', 'roles')
        .leftJoin('user.jobPosition', 'jobPositions')
        .leftJoin('user.team', 'teams')
        .where('user.email = :email', { email: email })
        .getOne();
      return await queryBuilder;
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  //Staff
  public async updateUserProfile(id: number, data: UserProfileDTO): Promise<UserEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  //HR
  public async updateUserInfor(id: number, data: UserDTO): Promise<UserEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
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
