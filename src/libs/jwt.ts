import { sign, verify } from 'jsonwebtoken';

import accessEnv from './accessEnv';
import { JwtPayload } from '@app/constants/app.interfaces';

const JWT_SECRET = accessEnv('JWT_SECRET');

export const createJWT = (payload: JwtPayload, expiresIn: number): string => {
  return sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJWT = (token: string): string => {
  return verify(token, JWT_SECRET) as string;
};
