export enum TableName {
  User = 'users',
  Objective = 'objectives',
  Team = 'teams',
  JobPosition = 'job_positions',
  Role = 'roles',
  UserTeam = 'user_teams',
  LessonOKRs = 'lesson_okrs',
  KeyResult = 'key_results',
  MeasureUnit = 'measure_units',
  Cycle = 'cycles',
  Checkin = 'checkins',
  Recognition = 'recognitions',
  Feeback = 'feedbacks',
  EvaluationCriteria = 'evaluation_criterias',
  TemplateCheckin = 'template_checkins',
  FieldTemplate = 'field_templates',
  UserStar = 'user_stars',
  Lesson = 'lessons',
  InviteToken = 'invite_tokens',
}

export enum DbConfig {
  DB_TYPE = 'postgres',
  DB_HOST = 'DB_HOST',
  DB_USER = 'DB_USER',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_NAME = 'DB_NAME',
  DB_PORT = 'DB_PORT',
}

export enum RoleEnum {
  ADMIN = 'ADMIN',
  HR = 'HR',
  STAFF = 'STAFF',
}

export enum ForeignKey {
  ROLE_ID = 'roleId',
  JOB_POSITION_ID = 'jobPositionId',
  USER_ID = 'userId',
  TEAM_ID = 'teamId',
  CYCLE_ID = 'cycleId',
  MEASURE_UNIT_ID = 'measureUnitId',
  TEMPLATE_ID = 'templateId',
  TEMPLATE_CHECKIN_ID = 'templateCheckinId',
  CHECKIN_ID = 'checkinId',
  EVALUATION_CRITERIA_ID = 'evaluationCriteriaId',
  OBJECTIVE_ID = 'objectiveId',
  PARENT_OBJECTIVE_ID = 'parentObjectiveId',
  ALIGN_OBJECTIVE_ID = 'alignObjectivesId',
  KEY_RESULTS_ID = 'keyResultId',
}

export enum EvaluationCriteriaEnum {
  MEMBER_TO_LEADER = 'MEMBER_TO_LEADER',
  LEADER_TO_MEMBER = 'LEADER_TO_MEMBER',
}

export enum ObjectiveTypeEnum {
  MOON_SHOT = 'Moonshot',
  ROOF_SHOT = 'Roofshot',
}

export enum GenderEnum {
  FEMALE = 0,
  MALE = 1,
  OTHER = 2,
}

export enum RouterEnum {
  EVALUATION_CRITERIA_ROUTE = 'localhost:3000/api/v1/evaluation-criterias',
  MEASURE_UNIT_ROUTE = 'localhost:3000/api/v1/measure-units',
  API_HOST_ROUTER = 'http://localhost:3000',
  FE_HOST_ROUTER = 'http://localhost:5000',
  USER_ROUTE = 'http://localhost:3000/api/v1/users',
  TEAM_ROUTE = 'http://localhost:3000/api/v1/teams',
}

export enum CommonMessage {
  SUCCESS = 'success',
  BAD_REQUEST = 'Bad request',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  PASSWORD_UPDATE_SUCCESS = 'Password successfully updated',
  PASSWORD_FAIL = 'Password is incorrect',
  VALID_TOKEN = 'Token is valid',
  INVALID_TOKEN = 'Token is invalid',
  EXPIRED_TOKEN = 'Token is expired',
  EMAIL_SENT = 'Email sent successfully',
  USER_DO_NOT_EXIST = `User doesn't exist`,
  DATABASE_EXCEPTION = 'Error when access to database',
  DELETE_FAIL = 'Delete fail',
  LOGOUT_SUCCESS = 'Logout success',
}

export enum Status {
  ACTIVE = 1,
  PENDING = 0,
  DEAVCTIVE = -1,
}
