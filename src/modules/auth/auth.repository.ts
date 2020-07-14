import { Repository } from 'typeorm';
import { InviteTokenEntity } from '@app/db/entities/invite-token.entity';

export class AuthRepository extends Repository<InviteTokenEntity> {}
