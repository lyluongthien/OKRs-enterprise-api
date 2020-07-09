import { Repository, EntityRepository } from 'typeorm';
import { RoleEntity } from '@app/db/entities/role.entity';

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {
  public async getRoleOfUser(userID: number): Promise<RoleEntity> {
    // return await this.findOneOrFail({ where: { users: { value: { id: userID }, useParameter: true } } });
    return await this.findOneOrFail({ relations: ['users'], where: {} });
  }
}
