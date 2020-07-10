import { Repository, EntityRepository, ObjectLiteral, FindOneOptions } from 'typeorm';

import { UserTeamEntity } from '@app/db/entities/user-team.entity';
import { UserTeamDTO } from './user-team.dto';

@EntityRepository(UserTeamEntity)
export class UserTeamRepository extends Repository<UserTeamEntity> {
  //HR
  public async updateUserTeamInfor(userId: number, userTeam: UserTeamDTO): Promise<void> {
    await this.update({ userId }, userTeam);
  }
}
