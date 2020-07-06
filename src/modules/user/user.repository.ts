import { Repository, EntityRepository } from 'typeorm';

import { UserEntity } from '@app/db/entities/user.entity';
import { ObjectLiteral } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ApproveRequestDTO } from './dto/approve-request.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public async getList(): Promise<UserEntity[]> {
    return await this.find();
  }

  public async getUserById(id: number): Promise<UserEntity> {
    return await this.findOne({ where: { id } });
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.findOne({ where: { email } });
  }

  public async getUserByApproveStatus(isApproved: boolean): Promise<UserEntity[]> {
    return await this.find({ where: { isApproved } });
  }

  public async updateUserById(id: number, user: CreateUserDto): Promise<UserEntity> {
    await this.update({ id }, user);
    return this.getUserById(id);
  }

  public async updateUserByApproveStatus(isApproved: boolean, user: ApproveRequestDTO): Promise<UserEntity[]> {
    await this.update({ isApproved }, user);
    return this.getUserByApproveStatus(isApproved);
  }

  public async deleteUser(id: number): Promise<ObjectLiteral> {
    await this.delete({ id });
    return { isDeleted: true };
  }
}
