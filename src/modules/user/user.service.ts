import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { generate } from 'generate-password';
import { hashSync, compareSync } from 'bcryptjs';

import { ResetPasswordDTO, ChangePasswordDTO, UserDTO, UserProfileDTO, PasswordDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { _salt } from '@app/constants/app.config';
import { invalidTokenResetPassword, tokenExpired } from '@app/constants/app.exeption';
import { sendEmail } from '@app/services/email/sendEmail';
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
    const currentUser = await this._userRepository.getUserByEmail(email);
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
    const currentUser = await this._userRepository.getUserByID(id);
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
    return await this._userRepository.deleteUser(id);
  }

  public async getUsersActived(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.getUsersActived(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getUsersApproved(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.getUsersApproved(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getUsersDeactived(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.getUsersDeactived(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getUserByID(id: number): Promise<ResponseModel> {
    const data = await this._userRepository.getUserByID(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getUserByEmail(email: string): Promise<ResponseModel> {
    const data = await this._userRepository.getUserByEmail(email);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async searchUsersActived(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.searchUsersActived(text, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async searchUsersApproved(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.searchUsersApproved(text, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
  public async searchUsersDeactived(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.searchUsersDeactived(text, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  //HR
  public async updateUserInfor(id: number, data: UserDTO): Promise<ResponseModel> {
    const userInfor = await this._userRepository.updateUserInfor(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: userInfor,
    };
  }

  //Staff
  public async updateUserProfile(id: number, data: UserProfileDTO): Promise<ResponseModel> {
    const userProfile = await this._userRepository.updateUserProfile(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: userProfile,
    };
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
