import 'dotenv/config';
import accessEnv from '@app/libs/accessEnv';
import { genSaltSync } from 'bcryptjs';
import { rateLimitWindowMs, rateLimitMax } from './app.magic-number';

/**
 * Interval time 1 hour
 * Up to 5000 requests per ip
 */
export const API_REQUEST_RATE_LIMIT = {
  windowMs: rateLimitWindowMs,
  max: rateLimitMax,
};

export const environment = accessEnv('NODE_ENV');
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'production');

const SALT_WORK_FACTORY = accessEnv('SALT_WORK_FACTORY');
export const _salt = genSaltSync(+SALT_WORK_FACTORY);
export const defaultJwtModuleOption = {
  secret: accessEnv('JWT_SECRET'),
  expiresIn: 5184000, //# Expires in 2 months = 2(month) * 30(day) * 24(hours) * 60(minutes) * 60(second) ,
};

export const passwordValidation = {
  regex: /^(?=.*\d)[0-9a-zA-Z]{8,}$/,
  message: 'Should contain at least 1 digit and 8 characters',
};

export const ROLE_KEY = 'roles';
