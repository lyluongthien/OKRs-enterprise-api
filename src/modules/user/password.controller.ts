import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Param, Put } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { UserService } from './user.service';
import { ResetPasswordDTO, PasswordDTO } from './user.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';

@Controller('/api/v1/reset_password')
@SwaggerAPI()
export class PasswordController {
  constructor(private _userService: UserService) {}

  /**
   * @description: Send mail to user a links, then use this link to reset password
   */
  @Post()
  @UsePipes(new ValidationPipe())
  public async forgetPassword(@Body() user: ResetPasswordDTO): Promise<ResponseModel> {
    return this._userService.forgetPassword(user);
  }

  /**
   * @description: Verify token in links
   */
  @Get(':token')
  public async verifyForgotPassword(@Param('token') token: string): Promise<ObjectLiteral> {
    return this._userService.verifyForgetPassword(token);
  }

  /**
   * @description: Save new password of user
   */
  @Put()
  @UsePipes(new ValidationPipe())
  public async resetPassword(@Body() data: PasswordDTO): Promise<ResponseModel> {
    return this._userService.resetPassword(data);
  }
}
