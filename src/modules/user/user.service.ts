import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/db/entities/user.entity';
import { hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { _salt } from '@app/constants/app.config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async signIn(user: CreateUserDto): Promise<UserEntity> {
    const { email } = user;
    let newUser = await this.userRepository.findOne({ where: { email } });
    if (newUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    newUser = await this.userRepository.create(user);
    newUser.password = hashSync(newUser.password, _salt);
    await this.userRepository.save(user);
    return newUser;
  }
}
