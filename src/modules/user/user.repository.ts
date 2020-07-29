import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { InternalServerErrorException, HttpException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

import { UserEntity } from '@app/db/entities/user.entity';
import { UserDTO, UserProfileDTO, ResetPasswordTokenDTO } from './user.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getUsersApproved(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .select(['user.id', 'user.email', 'user.fullName', 'user.isLeader', 'user.isApproved', 'user.isActive'])
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoinAndSelect('user.jobPosition', 'jobPositions')
        .leftJoinAndSelect('user.team', 'teams')
        .where('user.isActive = true and user.isApproved = false');
      return await paginate<UserEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getUserByID(id: number): Promise<UserEntity> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoinAndSelect('user.jobPosition', 'jobPositions')
        .leftJoinAndSelect('user.team', 'teams')
        .where('user.id = :id', { id: id })
        .getOne();
      return await queryBuilder;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    try {
      const queryBuilder = this.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'roles')
        .leftJoinAndSelect('user.jobPosition', 'jobPositions')
        .leftJoinAndSelect('user.team', 'teams')
        .where('user.email = :email', { email: email })
        .getOne();
      return await queryBuilder;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  //Staff
  public async updateUserProfile(id: number, data: UserProfileDTO): Promise<void> {
    try {
      await this.update({ id }, data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  //HR
  public async updateUserInfor(id: number, data: UserDTO): Promise<UserEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getUserRole(id: number): Promise<UserEntity> {
    try {
      return await this.findOneOrFail({
        relations: ['role'],
        where: { id },
      });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateResetPasswordToken(email: string, data: ResetPasswordTokenDTO): Promise<UserEntity> {
    try {
      await this.update({ email }, data);
      return await this.findOne({ email });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getUserByResetPasswordToken(token: string): Promise<UserEntity> {
    try {
      return await this.findOne({ where: { resetPasswordToken: token } });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updatePassword(id: number, data: ObjectLiteral, isChangePassword: boolean): Promise<void> {
    try {
      // Update aceptTokenAfter => logout
      if (isChangePassword) {
        const aceptTokenAfter = new Date();
        await this.update({ id }, { aceptTokenAfter });
      }

      await this.update({ id }, data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
  public async approveRequest(id: number[]): Promise<void> {
    try {
      if (id === undefined || id.length < 1) {
        await this.update({ isApproved: false }, { isApproved: true, isActive: true });
      } else {
        await this.update(id, { isApproved: true, isActive: true });
      }
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
