import { Repository, EntityRepository, ObjectLiteral, FindOneOptions } from 'typeorm';

import { UserEntity } from '@app/db/entities/user.entity';
import { RegisterDTO } from '../auth/auth.dto';
import { UpdateUserDTO } from './user.dto';
import { UserTeamEntity } from '@app/db/entities/user-team.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async getList(): Promise<UserEntity[]> {
    return await this.find();
  }

  public async getUserByConditions(id?: number, options?: FindOneOptions): Promise<UserEntity> {
    return await this.findOne(id, options);
  }

  public async updateUserById(id: number, user: RegisterDTO): Promise<UserEntity> {
    await this.update({ id }, user);
    return this.getUserByConditions(id);
  }

  public async deleteUser(id: number): Promise<ObjectLiteral> {
    await this.delete({ id });
    return { isDeleted: true };
  }

  public async getUsers(): Promise<UserEntity[]> {
    return await this.find({
      relations: ['role', 'jobPosition', 'userToTeams', 'userToTeams.team'],
    });
  }

  public async getUserDetail(id: number): Promise<UserEntity[]> {
    return await this.find({
      relations: ['role', 'jobPosition', 'userToTeams', 'userToTeams.team'],
      where: { id },
    });
  }
  //HR
  public async updateUserInfor(id: number, user: UpdateUserDTO): Promise<UserEntity> {
    await this.update({ id }, user);
    return this.getUserByConditions(id);
  }
}
