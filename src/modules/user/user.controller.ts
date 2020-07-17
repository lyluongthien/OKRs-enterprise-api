import { ObjectLiteral } from 'typeorm';
import { Controller, Post, Body, UsePipes, Put, Param, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { limitPagination, currentPage } from '@app/constants/app.magic-number';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UserService } from './user.service';
import { ChangePasswordDTO, UserDTO, UserProfileDTO } from './user.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CurrentUser } from './user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { ResponseModel } from '@app/constants/app.interface';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/role.decorator';
import { RoleEnum, CommonMessage } from '@app/constants/app.enums';
import { ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@Controller('/api/v1/users')
@UseGuards(AuthenticationGuard)
export class UserController {
  constructor(private _userService: UserService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public async getUsers(@Query('page') page: number, @Query('limit') limit: number): Promise<Pagination<UserEntity>> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._userService.getUsers({
      page,
      limit,
      route: '',
    });
  }

  @Get('/search')
  @UseGuards(AuthenticationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public async searchUsers(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Pagination<UserEntity>> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._userService.searchUsers(text, {
      page,
      limit,
      route: '',
    });
  }

  /**
   * @description: Get information of current logged in system
   */
  @Get('me')
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async me(@CurrentUser() user: UserEntity): Promise<any> {
    return this._userService.getUserDetail(user.id);
  }

  /**
   * @description: Update information of current logged in system
   */
  @Post('me')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public updateUserProfile(@CurrentUser() user: UserEntity, @Body() data: UserProfileDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserProfile(user.id, data);
  }

  /**
   * @description: Change password of current logged in system
   */
  @Put('/me/change_password')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async changePassword(
    @CurrentUser() user: UserEntity,
    @Body() data: ChangePasswordDTO,
  ): Promise<ResponseModel> {
    return this._userService.changePassword(user.id, data);
  }

  /**
   * @description: Log out current logged in system
   */
  @Post('me/logout')
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async logout(@CurrentUser() user: UserEntity): Promise<ResponseModel> {
    return await this._userService.logout(user.id);
  }

  /**
   * @description: Get detail user, when manage staff
   * @requires: ADMIN + HR
   */
  @Get(':id')
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async getUserDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._userService.getUserDetail(id);
  }

  /**
   * @description: Reject request of new member, when manage staff
   * @requires: ADMIN + HR
   */
  @Put('reject_request/:id')
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async rejectRequest(@Param('id') id: number): Promise<ObjectLiteral> {
    return this._userService.rejectRequest(id);
  }

  /**
   * @description: Update information of detail user, when manage staff
   * @requires: ADMIN + HR
   */
  @Put(':id')
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public updateUserInfo(@Param('id') id: number, @Body() data: UserDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserInfor(id, data);
  }
}
