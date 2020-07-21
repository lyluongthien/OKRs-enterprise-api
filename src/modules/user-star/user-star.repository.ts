import { EntityRepository, Repository } from 'typeorm';
import { UserStarEntity } from '@app/db/entities/user-stars.entity';

@EntityRepository(UserStarEntity)
export class UserStarRepository extends Repository<UserStarEntity> {}
