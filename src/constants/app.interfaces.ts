import { UserEntity } from '@app/db/entities/user.entity';

export interface JwtPayload {
  id: number;
}

export interface UserToken {
  user: UserEntity;
  token: string;
}
