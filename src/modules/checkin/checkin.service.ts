import { Injectable } from '@nestjs/common';

import { CheckinRepository } from './checkin.repository';

@Injectable()
export class CheckinService {
  constructor(private readonly _checkinRepository: CheckinRepository) {}
}
