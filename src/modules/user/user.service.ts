import { Injectable, HttpException } from '@nestjs/common';
import { UserEntity } from '@app/db/entities/user.entity';
import { hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { _salt } from '@app/constants/app.config';
import { UserRepository } from './user.repository';
import { EX_EMAIL_EXISTS } from '@app/constants/app.exeption';
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async signUp(user: CreateUserDto): Promise<UserEntity> {
    const { email } = user;
    let newUser = await this.userRepository.findOneWithCondition({ where: { email } });
    if (newUser) {
      throw new HttpException(EX_EMAIL_EXISTS.message, EX_EMAIL_EXISTS.errorCode);
    }
    newUser = await this.userRepository.create(user);
    newUser.password = hashSync(newUser.password, _salt);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
