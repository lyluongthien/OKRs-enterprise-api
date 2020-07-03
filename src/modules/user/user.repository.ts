import { BaseRepository } from '@app/libs/baseRepository';
import { UserEntity } from '@app/db/entities/user.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {}
