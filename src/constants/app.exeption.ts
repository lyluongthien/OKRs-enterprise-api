import { HttpStatus } from '@nestjs/common';

export const httpEmailExists = {
  message: 'Email already exists',
  errorCode: HttpStatus.CONFLICT,
};

export const httpUnauthenticated = {
  message: `Not authenticated`,
  statusCode: HttpStatus.FORBIDDEN,
};

export const httpUnauthorized = {
  message: `Unauthorized access`,
  statusCode: HttpStatus.UNAUTHORIZED,
};

export const httpDatabaseException = {
  statusCode: HttpStatus.BAD_REQUEST,
  message: `Exception when handle with database`,
};

export const invalidCredential = 'Invalid credentials';
export const missingAuthenticationGuard = `Could not find user under execution context. 
Please make sure AuthenticationGuard are defined first.`;
export const notLocatedUserToContext = 'Could not locate user under application context';
export const invalidTokenResetPassword = 'Reset password token is invalid';
export const tokenExpired = 'Token is expired';
