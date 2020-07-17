import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { generate } from 'generate-password';
import { hashSync, compareSync } from 'bcryptjs';

import { ResetPasswordDTO, ChangePasswordDTO, UserDTO, UserProfileDTO, PasswordDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { _salt } from '@app/constants/app.config';
import { invalidTokenResetPassword, tokenExpired } from '@app/constants/app.exeption';
import { sendEmail } from '@app/services/email/sendEmail';
import { UserEntity } from '@app/db/entities/user.entity';
import { RoleEntity } from '@app/db/entities/role.entity';
import { RouterEnum, CommonMessage } from '@app/constants/app.enums';
import { expireResetPasswordToken } from '@app/constants/app.magic-number';
import { ResponseModel } from '@app/constants/app.interface';

@Injectable()
export class UserService {
  constructor(private _userRepository: UserRepository) {}

  /**
   * @description Send a link in email to user, then use this link to reset password
   */
  public async forgetPassword(user: ResetPasswordDTO): Promise<ResponseModel> {
    const { email } = user;
    const currentUser = await this._userRepository.findUserByEmail(email);
    if (!currentUser) {
      throw new HttpException('Email do not exist', HttpStatus.BAD_REQUEST);
    }

    const token = generate({ length: 30, numbers: true, lowercase: true, uppercase: true });
    const expireDate = new Date();

    await this._userRepository.updateResetPasswordToken(email, {
      resetPasswordToken: token,
      resetPasswordTokenExpire: expireDate,
    });

    const url = RouterEnum.FE_HOST_ROUTER + `/reset-password?token=${token}`;
    const subject = '[Flame-OKRs] | Lấy lại mật khẩu';
    const html = `  <p>Chúng tôi đã nhận được yêu cầu đổi mật khẩu của bạn.</p>
                    <p>Bạn vui lòng truy cập đường link dưới đây để đổi mật khẩu.</p>
                    <a href="${url}">${url}</a>`;

    sendEmail(email, subject, html);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.EMAIL_SENT,
      data: {},
    };
  }

  /**
   * @description verify reset password token: valid | invalid
   */
  public async verifyForgetPassword(token: string): Promise<ResponseModel> {
    const user = await this._userRepository.getUserByResetPasswordToken(token);
    if (!user) {
      throw new HttpException(CommonMessage.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }
    const now = new Date().getTime();
    const expireTime = user.resetPasswordTokenExpire.getTime();
    const dueTime = now - expireTime;

    if (dueTime > expireResetPasswordToken) {
      throw new HttpException(CommonMessage.EXPIRED_TOKEN, HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.VALID_TOKEN,
      data: {},
    };
  }

  /**
   * @description: Save new password of user
   */
  public async resetPassword(token: string, data: PasswordDTO): Promise<ResponseModel> {
    const user = await this._userRepository.getUserByResetPasswordToken(token);
    if (!user) {
      throw new HttpException(invalidTokenResetPassword, HttpStatus.BAD_REQUEST);
    }
    const now = new Date().getTime();
    const expireTime = user.resetPasswordTokenExpire.getTime();
    const dueTime = now - expireTime;

    if (dueTime > expireResetPasswordToken) {
      throw new HttpException(tokenExpired, HttpStatus.BAD_REQUEST);
    }
    // Hash password
    data.password = hashSync(data.password, _salt);
    await this._userRepository.updatePassword(user.id, data, false);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.PASSWORD_UPDATE_SUCCESS,
      data: {},
    };
  }

  /**
   * @description: Change password for me
   */
  public async changePassword(id: number, user: ChangePasswordDTO): Promise<ResponseModel> {
    const currentUser = await this._userRepository.getUserByConditions(id);
    if (!currentUser) {
      throw new HttpException(CommonMessage.USER_DO_NOT_EXIST, HttpStatus.BAD_REQUEST);
    }
    const isMatchedPassword = await compareSync(user.password, currentUser.password);
    if (!isMatchedPassword) {
      throw new HttpException(CommonMessage.PASSWORD_FAIL, HttpStatus.CONFLICT);
    }
    user.newPassword = hashSync(user.newPassword, _salt);

    await this._userRepository.updatePassword(id, { password: user.newPassword }, true);

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.PASSWORD_UPDATE_SUCCESS,
      data: {},
    };
  }

  public async rejectRequest(id: number): Promise<ObjectLiteral> {
    return await this._userRepository.delete({ id });
  }

  public async getUsers(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    return await this._userRepository.getUsers(options);
  }

  public async getUserDetail(id: number): Promise<ResponseModel> {
    const data = await this._userRepository.getUserDetail(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async searchUsers(text: string, options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    return await this._userRepository.searchUsers(text, options);
  }

  public async updateUserInfor(id: number, data: UserDTO): Promise<ObjectLiteral> {
    return this._userRepository.update(id, data);
  }

  public async updateUserProfile(id: number, data: UserProfileDTO): Promise<ObjectLiteral> {
    return this._userRepository.updateUserProfile(id, data);
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    return await this._userRepository.getUserByConditions(null, {
      where: {
        email,
      },
    });
  }

  public async getUserById(id: number): Promise<UserEntity> {
    return await this._userRepository.getUserByConditions(id);
  }

  public async getRoleByUserID(id: number): Promise<RoleEntity> {
    const userRole = await this._userRepository.getUserRole(id);
    return userRole.role;
  }

  public async logout(id: number): Promise<ResponseModel> {
    try {
      const now = new Date();
      this._userRepository.update({ id }, { aceptTokenAfter: now });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.LOGOUT_SUCCESS,
      data: {},
    };
  }
}
