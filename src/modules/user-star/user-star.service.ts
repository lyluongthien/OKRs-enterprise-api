import { Injectable } from '@nestjs/common';
import { UserStarRepository } from './user-star.repository';

@Injectable()
export class UserStarService {
  constructor(private _userStarRepository: UserStarRepository) {}
}
