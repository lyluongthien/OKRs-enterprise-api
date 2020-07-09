import { Repository, EntityRepository } from 'typeorm';
import { InviteTokenEntity } from '@app/db/entities/invite-token.entity';

@EntityRepository(InviteTokenEntity)
export class InviteTokenRepositiory extends Repository<InviteTokenEntity> {}
