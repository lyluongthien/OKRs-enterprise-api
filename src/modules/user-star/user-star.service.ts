import { Injectable, HttpStatus } from '@nestjs/common';

import { ResponseModel } from '@app/constants/app.interface';
import { UserStarRepository } from './user-star.repository';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class UserStarService {
  constructor(private _userStarsRepository: UserStarRepository) {}

  public async getUserStar(cycleId?: number): Promise<ResponseModel> {
    let data = null;
    if (cycleId) {
      data = await this._userStarsRepository.getCycleUserStar(cycleId);
    } else {
      data = await this._userStarsRepository.getAllUserStar();
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
