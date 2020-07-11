import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { InviteTokenEntity } from '@app/db/entities/invite-token.entity';

@EntityRepository(InviteTokenEntity)
export class InviteTokenRepositiory extends Repository<InviteTokenEntity> {
  public async createToken(data: ObjectLiteral): Promise<InviteTokenEntity> {
    return await this.save(data);
  }
}
