import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { generate } from 'generate-password';
import { ObjectLiteral } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { UserRepository } from './user.repository';
import { _salt } from '@app/constants/app.config';
import { sendEmail } from '@app/services/email/sendEmail';
import { ResetPasswordDTO, ChangePasswordDTO } from './user.dto';
import { UserEntity } from '@app/db/entities/user.entity';
import { InviteTokenRepositiory } from './invite-token.repository';

@Injectable()
export class UserService {
  constructor(private _userRepository: UserRepository, private _inviteTokenRepository: InviteTokenRepositiory) {}

  /**
   * @description Reset password and send mail for staff
   */
  public async resetPassword(user: ResetPasswordDTO): Promise<void> {
    const { email } = user;
    const currentUser = await this._userRepository.getUserByConditions(null, { where: { email } });
    if (!currentUser) {
      throw new HttpException('Email do not exist', HttpStatus.BAD_REQUEST);
    }

    const newPassword = generate({ length: 10, numbers: true, lowercase: true, uppercase: true });

    user.password = hashSync(newPassword, _salt);
    await this._userRepository.update({ email }, user);
    sendEmail(email, newPassword);
  }

  public async changePassword(id: number, user: ChangePasswordDTO): Promise<ObjectLiteral> {
    const currentUser = await this._userRepository.getUserByConditions(id);
    if (!currentUser) {
      throw new HttpException('User do not exist', HttpStatus.BAD_REQUEST);
    }
    user.password = hashSync(user.password, _salt);

    await this._userRepository.update({ id }, user);

    return this._userRepository.getUserByConditions(id);
  }

  public async rejectRequest(id: number): Promise<ObjectLiteral> {
    return await this._userRepository.delete({ id });
  }

  public async getUsers(): Promise<UserEntity[]> {
    return await this._userRepository.getUsers();
  }

  public async getUserDetail(id: number): Promise<UserEntity[]> {
    return await this._userRepository.getUserDetail(id);
  }

  public async generateLinkInvite(): Promise<ObjectLiteral> {
    const token = generate({ length: 30, numbers: true, lowercase: true, uppercase: true });
    return { token: token };
  }
}
