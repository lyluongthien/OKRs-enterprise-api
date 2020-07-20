import { ObjectLiteral } from 'typeorm';
import { Controller, Post, Body, UsePipes, Put, Param, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { limitPagination, currentPage } from '@app/constants/app.magic-number';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';

import { UserService } from './user.service';
import { ChangePasswordDTO, UserDTO, UserProfileDTO, ApproveRequestDTO } from './user.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CurrentUser } from './user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { ResponseModel } from '@app/constants/app.interface';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../role/role.decorator';
import { RoleEnum, CommonMessage, Status } from '@app/constants/app.enums';
import { ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@Controller('/api/v1/users')
@UseGuards(AuthenticationGuard)
export class UserController {
  constructor(private _userService: UserService) {}

  /**
   * @description: Get list of user by status
   * 1: Active, -1: Deactive, 0: Pending
   */
  @Get()
  @UseGuards(AuthorizationGuard)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  public async searchUsersActived(
    @Query('status') status: number,
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    if (status == Status.ACTIVE) {
      if (text) {
        return this._userService.searchUsersActived(text, {
          page,
          limit,
          route: '',
        });
      }
      return this._userService.getUsersActived({
        page,
        limit,
        route: '',
      });
    }
    if (status == Status.PENDING) {
      if (text) {
        return this._userService.searchUsersApproved(text, {
          page,
          limit,
          route: '',
        });
      }
      return this._userService.getUsersApproved({
        page,
        limit,
        route: '',
      });
    }

    if (status == Status.DEAVCTIVE) {
      if (text) {
        return this._userService.searchUsersDeactived(text, {
          page,
          limit,
          route: '',
        });
      }
      return this._userService.getUsersDeactived({
        page,
        limit,
        route: '',
      });
    }
  }

  /**
   * @description: Get information of current logged in system
   */
  @Get('me')
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async me(@CurrentUser() user: UserEntity): Promise<any> {
    return this._userService.getUserByID(user.id);
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
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async getUserDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._userService.getUserByID(id);
  }

  /**
   * @description: Reject request of new member, when manage staff
   * @requires: ADMIN + HR
   */
  @Put('reject_request/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public async rejectRequest(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._userService.rejectRequest(id);
  }

  /**
   * @description: Approve request of new member
   * @requires: ADMIN + HR
   */
  @Put('approve_request')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public approveRequest(@Body() data: ApproveRequestDTO): Promise<ResponseModel> {
    return this._userService.approveRequest(data.id);
  }

  /**
   * @description: Update information of detail user, when manage staff
   * @requires: ADMIN + HR
   */
  @Put(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: CommonMessage.SUCCESS })
  @ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST })
  public updateUserInfo(@Param('id') id: number, @Body() data: UserDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserInfor(id, data);
  }
}
