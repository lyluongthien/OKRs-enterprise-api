import { Injectable } from '@nestjs/common';
import { UserEntity } from '@app/db/entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public getListUser(): Promise<UserEntity[]> {
    return this.userRepository.getList();
  }
}
