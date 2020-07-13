import { Repository, EntityRepository } from 'typeorm';
import { RoleEntity } from '@app/db/entities/role.entity';

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {}
