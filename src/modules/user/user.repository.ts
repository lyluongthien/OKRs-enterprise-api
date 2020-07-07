import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';

import { UserEntity } from '@app/db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { TableName } from '@app/constants/app.enums';

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

  public async updateUserById(id: number, user: CreateUserDto): Promise<UserEntity> {
    await this.update({ id }, user);
    return this.getUserById(id);
  }

  public async deleteUser(id: number): Promise<ObjectLiteral> {
    await this.delete({ id });
    return { isDeleted: true };
  }

  public async getAllUser(): Promise<UserEntity[]> {
    return this.createQueryBuilder(TableName.User)
      .leftJoinAndSelect(TableName.User + '.role', TableName.Role)
      .leftJoinAndSelect(TableName.User + '.jobPosition', TableName.JobPosition)
      .getMany();
  }
}
