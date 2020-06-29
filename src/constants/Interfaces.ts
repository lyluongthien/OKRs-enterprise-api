import { UserEntity } from '@db/entities/User';

export interface JwtPayload {
  id: number;
}

export interface UserToken {
  user: UserEntity;
  token: string;
}
