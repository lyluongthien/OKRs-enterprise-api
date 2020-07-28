import { Controller, UseGuards, Post, UsePipes, Body } from '@nestjs/common';

import { AuthenticationGuard } from '../auth/authentication.guard';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { RecognitionService } from './recognition.service';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { RoleEnum } from '@app/constants/app.enums';
import { Roles } from '../role/role.decorator';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { ResponseModel } from '@app/constants/app.interface';
import { RecognitionDTO } from './recognition.dto';
import { CurrentUser } from '../user/user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';

@Controller('/api/v1/recognitions')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class RecognitionController {
  constructor(private _recognitionService: RecognitionService) {}

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  public createRecognition(
    @Body() recognition: RecognitionDTO,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseModel> {
    return this._recognitionService.createRecognition(recognition, user.id);
  }
}
