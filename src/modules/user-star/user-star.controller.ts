import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { UserStarService } from './user-star.service';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { ResponseModel } from '@app/constants/app.interface';

@Controller('/api/v1/user_star')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class UserStarController {
  constructor(private _userStarService: UserStarService) {}

  @Get()
  public getUserStars(@Query('status') status: string): Promise<ResponseModel> {
    return this._userStarService.getUserStar(status);
  }
}
