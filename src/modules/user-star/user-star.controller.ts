import { Controller, UseGuards, Get } from '@nestjs/common';
import { UserStarService } from './user-star.service';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { UserStarRepository } from './user-star.repository';
import { UserStarEntity } from '@app/db/entities/user-stars.entity';

@UseGuards(AuthenticationGuard)
@Controller('/api/v1/user-stars')
export class UserStarController {
  constructor(private _userStartService: UserStarService) {}

  @Get()
  public async getUserStar(): Promise<UserStarEntity> {
    return null;
  }
}
