import { Repository, EntityRepository } from 'typeorm';

import { CheckinEntity } from '@app/db/entities/checkin.entity';

@EntityRepository(CheckinEntity)
export class CheckinRepository extends Repository<CheckinEntity> {}
