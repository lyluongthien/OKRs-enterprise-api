import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { hashSync } from 'bcryptjs';
import { generate } from 'generate-password';

import { UserEntity } from '@app/db/entities/user.entity';
import { sendEmail } from '@app/services/email/sendEmail';
import { EX_EMAIL_EXISTS } from '@app/constants/app.exeption';
import { _salt } from '@app/constants/app.config';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async signUp(user: CreateUserDto): Promise<UserEntity> {
    const { email } = user;
    let newUser = await this.userRepository.findOne({ where: { email } });
    if (newUser) {
      throw new HttpException(EX_EMAIL_EXISTS.message, EX_EMAIL_EXISTS.errorCode);
    }
    newUser = await this.userRepository.create(user);
    newUser.password = hashSync(newUser.password, _salt);
    await this.userRepository.save(newUser);
    return newUser;
  }

  /**
   * Author: DucPV
   * Reset password and send mail for staff
   */
  public async resetPassword(user: ResetPasswordDTO): Promise<ObjectLiteral> {
    const { email } = user;
    const currentUser = await this.userRepository.getUserByEmail(email);
    if (!currentUser) {
      throw new HttpException('Email do not exist', HttpStatus.BAD_REQUEST);
    }
    const newPassword = generate({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: true,
    });
    user.password = hashSync(newPassword, _salt);
    await this.userRepository.update({ email }, user);
    // Send mail to user
    sendEmail(email, newPassword);

    return this.userRepository.getUserByEmail(email);
  }

  /**
   * Author: DucPV
   * Change password
   */
  public async changePassword(id: number, user: ChangePasswordDTO): Promise<ObjectLiteral> {
    const currentUser = await this.userRepository.getUserById(id);
    if (!currentUser) {
      throw new HttpException('User do not exist', HttpStatus.BAD_REQUEST);
    }
    user.password = hashSync(user.password, _salt);

    await this.userRepository.update({ id }, user);

    return this.userRepository.getUserById(id);
  }

  /**
   * Author: QuangNV
   * Reject Request
   */
  public async rejectRequest(id: number): Promise<ObjectLiteral> {
    return await this.userRepository.delete({ id });
  }

  public async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.getUsers();
  }

  public async getUserDetail(id: number): Promise<UserEntity[]> {
    return await this.userRepository.getUserDetail(id);
  }
}
