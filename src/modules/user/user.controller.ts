import { ObjectLiteral } from 'typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  Put,
  Param,
  Get,
  UseGuards,
  Query,
  ParseIntPipe,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
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
import { RoleEnum, Status } from '@app/constants/app.enums';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/users')
@UseGuards(AuthenticationGuard)
@SwaggerAPI()
export class UserController {
  constructor(private _userService: UserService) {}

  @Put('upload_avatar/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  public uploadAvatar(@Param('id', ParseIntPipe) userId: number, @UploadedFile() file): Promise<ResponseModel> {
    return this._userService.uploadAvatar(userId, `${file.path}`);
  }
  /**
   * @description: Get list of user by status
   * 1: Active, -1: Deactive, 0: Pending
   */
  @Get()
  @UseGuards(AuthorizationGuard)
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
  public async me(@CurrentUser() user: UserEntity): Promise<any> {
    return this._userService.getUserByID(user.id);
  }

  /**
   * @description: Update information of current logged in system
   */
  @Put('me')
  @UsePipes(new ValidationPipe())
  public updateUserProfile(@CurrentUser() user: UserEntity, @Body() data: UserProfileDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserProfile(user.id, data);
  }

  /**
   * @description: Change password of current logged in system
   */
  @Put('/me/change_password')
  @UsePipes(new ValidationPipe())
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
  public async getUserDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._userService.getUserByID(id);
  }

  /**
   * @description: Reject request of new member, when manage staff
   * @requires: ADMIN + HR
   */
  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
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
  public updateUserInfo(@Param('id') id: number, @Body() data: UserDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserInfor(id, data);
  }
}
