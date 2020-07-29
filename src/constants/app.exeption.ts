export const httpEmailExists = 'Email đã tồn tại';
export const httpUnauthenticated = `Not authenticated`;
export const httpUnauthorized = `Unauthorized access`;
export const httpDatabaseException = `Exception when handle with database`;
export const invalidCredential = 'Invalid credentials';
export const missingAuthenticationGuard = `Could not find user under execution context. 
Please make sure AuthenticationGuard are defined first.`;
export const notLocatedUserToContext = 'Could not locate user under application context';
export const invalidTokenResetPassword = 'Reset password token is invalid';
export const tokenExpired = 'Token is expired';

//

export const INTERNAL_SERVER_ERROR = {
  statusCode: 500,
  message: `Có lỗi xảy ra`,
};

export const EMAIL_NOT_FOUND = {
  statusCode: 430,
  message: `Email không tồn tại`,
};

export const EMAIL_EXIST = {
  statusCode: 432,
  message: `Email đã tồn tại`,
};

export const PASSWORD_WRONG = {
  statusCode: 409,
  message: `Mât khẩu không chính xác`,
};

export const INVALID_TOKEN = {
  statusCode: 413,
  message: `Token không chính xác`,
};

export const EXPIRED_TOKEN = {
  statusCode: 414,
  message: `Token đã hết hạn`,
};

export const USER_LOOKED = {
  statusCode: 420,
  message: `Tài khoản của bạn đã bị khóa`,
};

export const USER_PENDING = {
  statusCode: 422,
  message: `Tài khoản của bạn đang chờ phê duyệt`,
};

export const CYCLE_EXIST = {
  statusCode: 440,
  message: `Tên chu kì đã tồn tại`,
};

export const EVALUATION_CRITERIA_EXIST = {
  statusCode: 441,
  message: `Tiêu chí đã tồn tại`,
};

export const JOB_EXIST = {
  statusCode: 442,
  message: `Vị trí công việc đã tồn tại`,
};

export const MEASURE_EXIST = {
  statusCode: 443,
  message: `Đơn vị đo đã tồn tại`,
};

export const TEAM_EXIST = {
  statusCode: 444,
  message: `Nhóm đã tồn tại`,
};

export const DATABASE_EXCEPTION = {
  statusCode: 490,
  message: `Có lỗi xảy ra khi thao tác với database`,
};
