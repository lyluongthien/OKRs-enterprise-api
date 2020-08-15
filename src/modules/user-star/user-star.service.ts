import { Injectable, HttpStatus } from '@nestjs/common';

import { ResponseModel } from '@app/constants/app.interface';
import { UserStarRepository } from './user-star.repository';
import { CommonMessage, CycleStatus } from '@app/constants/app.enums';
import { CycleRepository } from '../cycle/cycle.repository';

@Injectable()
export class UserStarService {
  constructor(private _userStarsRepository: UserStarRepository, private _cycleRepository: CycleRepository) {}

  public async getUserStar(status: CycleStatus): Promise<ResponseModel> {
    let data = null;
    if (status && status == CycleStatus.CURRENT) {
      const id = (await this._cycleRepository.getCurrentCycle(new Date())).id;
      data = await this._userStarsRepository.getCurrentUserStar(id);
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
