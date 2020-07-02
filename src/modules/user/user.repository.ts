import { Repository, EntityRepository } from 'typeorm';
import { UserEntity } from '@app/db/entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  public getList = async (): Promise<UserEntity[]> => {
    return await this.find();
  };
}
