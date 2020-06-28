import { sign, verify } from 'jsonwebtoken';
import accessEnv from '@libs/accessEnv';
import { JwtPayload } from '@constants/Interfaces';

const JWT_SECRET = accessEnv('JWT_SECRET', null);

export const createJWT = (payload: JwtPayload, expiresIn: number): string => {
  return sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJWT = (token: string): string => {
  return verify(token, JWT_SECRET) as string;
};
