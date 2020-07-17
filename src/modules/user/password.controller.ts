import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Put, Param } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { UserService } from './user.service';
import { ResetPasswordDTO, PasswordDTO } from './user.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { CommonMessage } from '@app/constants/app.enums';

@Controller('/api/v1/reset_password')
export class PasswordController {
  constructor(private _userService: UserService) {}

  /**
   * @description: Send mail to user a links, then use this link to reset password
   */
  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: CommonMessage.INTERNAL_SERVER_ERROR })
  public async forgetPassword(@Body() user: ResetPasswordDTO): Promise<ResponseModel> {
    return this._userService.forgetPassword(user);
  }

  /**
   * @description: Verify token in links
   */
  @Get(':token')
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async verifyForgotPassword(@Param('token') token: string): Promise<ObjectLiteral> {
    return this._userService.verifyForgetPassword(token);
  }

  /**
   * @description: Save new password of user
   */
  @Put(':token')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async resetPassword(@Param('token') token: string, @Body() data: PasswordDTO): Promise<ResponseModel> {
    return this._userService.resetPassword(token, data);
  }
}
