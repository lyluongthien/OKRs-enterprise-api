import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { generate } from 'generate-password';
import { hashSync, compareSync } from 'bcryptjs';

import { ResetPasswordDTO, ChangePasswordDTO, UserDTO, UserProfileDTO, PasswordDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { _salt } from '@app/constants/app.config';
import {
  INVALID_TOKEN,
  EXPIRED_TOKEN,
  PASSWORD_WRONG,
  TEAM_LEAD_EXIST,
  ACTION_BLOCKED,
} from '@app/constants/app.exeption';
import { sendEmail } from '@app/services/email/sendEmail';
import { RoleEntity } from '@app/db/entities/role.entity';
import { CommonMessage } from '@app/constants/app.enums';
import { expireResetPasswordToken } from '@app/constants/app.magic-number';
import { ResponseModel } from '@app/constants/app.interface';
import { paginationDataParser } from '@app/libs/pagination';
import accessEnv from '@app/libs/accessEnv';

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

    const url = accessEnv('FE_HOST') + `/dat-lai-mat-khau?token=${token}`;
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
      throw new HttpException(INVALID_TOKEN.message, INVALID_TOKEN.statusCode);
    }
    const now = new Date().getTime();
    const expireTime = user.resetPasswordTokenExpire.getTime();
    const dueTime = now - expireTime;

    if (dueTime > expireResetPasswordToken) {
      throw new HttpException(EXPIRED_TOKEN.message, EXPIRED_TOKEN.statusCode);
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
  public async resetPassword(data: PasswordDTO): Promise<ResponseModel> {
    const user = await this._userRepository.getUserByResetPasswordToken(data.token);
    if (!user) {
      throw new HttpException(INVALID_TOKEN.message, INVALID_TOKEN.statusCode);
    }
    const now = new Date().getTime();
    const expireTime = user.resetPasswordTokenExpire.getTime();
    const dueTime = now - expireTime;

    if (dueTime > expireResetPasswordToken) {
      throw new HttpException(EXPIRED_TOKEN.message, EXPIRED_TOKEN.statusCode);
    }
    // Hash password
    data.password = hashSync(data.password, _salt);
    await this._userRepository.updatePassword(user.id, { password: data.password }, false);
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
      throw new HttpException(PASSWORD_WRONG.message, PASSWORD_WRONG.statusCode);
    }
    user.newPassword = hashSync(user.newPassword, _salt);

    await this._userRepository.updatePassword(id, { password: user.newPassword }, true);

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.PASSWORD_UPDATE_SUCCESS,
      data: {},
    };
  }

  public async rejectRequest(id: number): Promise<ResponseModel> {
    const data = await this._userRepository.deleteUser(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async approveRequest(id: number[]): Promise<ResponseModel> {
    const data = await this._userRepository.approveRequest(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getUsersActived(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.getUsersActived(options);
    const dataResponse = paginationDataParser(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }

  public async getUserActived(): Promise<ResponseModel> {
    const data = await this._userRepository.getUserActived();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getUsersApproved(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.getUsersApproved(options);
    const dataResponse = paginationDataParser(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }

  public async getUsersDeactived(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.getUsersDeactived(options);
    const dataResponse = paginationDataParser(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }

  public async getUserByID(id: number): Promise<ResponseModel> {
    const data = await this._userRepository.getUserByID(id);
    const responseData = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      imageUrl: data.avatarURL ? data.avatarURL : data.gravatarURL,
      role: {
        id: data.role.id,
        name: data.role.name,
      },
      jobPosition: {
        id: data.jobPosition.id,
        name: data.jobPosition.name,
      },
      team: {
        id: data.team.id,
        name: data.team.name,
      },
      isLeader: data.isLeader,
      isActive: data.isActive,
      isApproved: data.isApproved,
    };
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: responseData,
    };
  }

  public async searchUsersActived(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.searchUsersActived(text.toLowerCase(), options);
    const dataResponse = paginationDataParser(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }

  public async searchUsersApproved(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.searchUsersApproved(text.toLowerCase(), options);
    const dataResponse = paginationDataParser(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }

  public async searchUsersDeactived(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._userRepository.searchUsersDeactived(text.toLowerCase(), options);
    const dataResponse = paginationDataParser(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: dataResponse,
    };
  }

  //HR
  public async updateUserInfor(id: number, data: UserDTO): Promise<ResponseModel> {
    let userInfor = null;
    if (data && id) {
      const admin = await this._userRepository.getAdmin();
      if (id == admin.id || data.roleId == admin.roleId)
        throw new HttpException(ACTION_BLOCKED.message, ACTION_BLOCKED.statusCode);
      if (data.isLeader == true) {
        const leader = await this._userRepository.getTeamLeader(id);
        if (leader && id != leader.id) throw new HttpException(TEAM_LEAD_EXIST.message, TEAM_LEAD_EXIST.statusCode);
        else userInfor = await this._userRepository.updateUserInfor(id, data);
      } else {
        userInfor = await this._userRepository.updateUserInfor(id, data);
      }
    }
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: userInfor,
    };
  }

  //Staff
  public async updateUserProfile(id: number, data: UserProfileDTO): Promise<ResponseModel> {
    await this._userRepository.updateUserProfile(id, data);
    return this.getUserByID(id);
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

  public async updateAvatarUrl(id: number, path: string): Promise<ResponseModel> {
    const data = await this._userRepository.updateAvatarUrl(id, path);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.UPLOAD_SUCCESS,
      data: data,
    };
  }

  public async getAdmin(): Promise<ResponseModel> {
    const data = (await this._userRepository.getAdmin()).id;
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
