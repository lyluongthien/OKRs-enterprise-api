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

export const TEAM_LEAD_EXIST = {
  statusCode: 430,
  message: `Team leader đã tồn tại`,
};

export const ACTION_BLOCKED = {
  statusCode: 435,
  message: `Không thể thực hiện thao tác này`,
};

export const CYCLE_EXIST = {
  statusCode: 440,
  message: `Tên chu kì đã tồn tại`,
};

export const EVALUATION_CRITERIA_EXIST = {
  statusCode: 440,
  message: `Tiêu chí đã tồn tại`,
};

export const JOB_EXIST = {
  statusCode: 440,
  message: `Vị trí công việc đã tồn tại`,
};

export const MEASURE_EXIST = {
  statusCode: 440,
  message: `Đơn vị đo đã tồn tại`,
};

export const TEAM_EXIST = {
  statusCode: 440,
  message: `Nhóm đã tồn tại`,
};

export const TARGET_VALUE_INVALID = {
  statusCode: 441,
  message: `Giá trị mục tiêu phải lớn hơn giá trị đã đạt được`,
};

export const UNSUPPORTED_FILE_TYPE = {
  statusCode: 450,
  message: `Định dạng file không hỗ trợ`,
};

export const DATABASE_EXCEPTION = {
  statusCode: 490,
  message: `Có lỗi xảy ra khi thao tác với database`,
};

export const CHECKIN_FOBIDDEN = {
  statusCode: 470,
  message: `Bạn không có quền truy cập checkin này`,
};

export const CHECKIN_DONE = {
  statusCode: 472,
  message: `Bạn không thể tạo checkin với trạng thái là Done`,
};

export const CHECKIN_STATUS = {
  statusCode: 475,
  message: `Bạn chỉ có thể checkin những form mà member gửi lên`,
};

export const CHECKIN_PENDING = {
  statusCode: 476,
  message: `Bạn không thể tạo checkin với Objective này`,
};

export const CHECKIN_COMPLETED = {
  statusCode: 478,
  message: `Bạn không thể lưu nháp Objective đã hoàn thành`,
};

export const DELETE_KEY_RESULT = {
  statusCode: 480,
  message: `Bạn không có quyền xóa key result này`,
};

export const DELETE_OKR = {
  statusCode: 481,
  message: `Bạn không có quyền xóa OKRs này`,
};

export const KEY_RESULT_INVALID = {
  statusCode: 404,
  message: `Key result không tồn tại`,
};

export const OKR_INVALID = {
  statusCode: 404,
  message: `OKRs không tồn tại`,
};

export const OKR_UPDATE_FAIL = {
  statusCode: 482,
  message: `Dữ liệu không hợp lệ`,
};

export const KEYRESULT_INVALID = {
  statusCode: 483,
  message: `Cần có ít nhất 1 kết quả then chốt`,
};
