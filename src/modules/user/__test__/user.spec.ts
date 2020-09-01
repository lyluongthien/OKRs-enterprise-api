import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import {
  UserProfileDTO,
  ChangePasswordDTO,
  UserDTO,
  ApproveRequestDTO,
  ResetPasswordDTO,
  PasswordDTO,
} from '../user.dto';
import { Status } from '@app/constants/app.enums';

describe('AuthController', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });
  const loginData: SignInDTO = {
    email: 'ducpvse05320@fpt.edu.vn',
    password: 'Admin123',
  };
  const loginDataChangePass: SignInDTO = {
    email: 'hiepdqse05627@fpt.edu.vn',
    password: 'Admin123',
  };

  let userToken: string;
  let userTokenChangePass: string;

  describe('me', () => {
    test('(GET) URL api wrong', () => {
      return request(app.getHttpServer()).get('/api/v1/usersXYZ/me').expect(404);
    });

    test('(POST) Login succes', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send(loginData)
        .expect((res) => {
          userToken = res.body.data.token;
          expect(res.body.data).toBeDefined();
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.user.email).toEqual(loginData.email);
          expect(res.body.data.token).toBeDefined();
        })
        .expect(201);
    });

    test('(POST) Login succes to test change password', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send(loginDataChangePass)
        .expect((res) => {
          userTokenChangePass = res.body.data.token;
          expect(res.body.data).toBeDefined();
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.user.email).toEqual(loginDataChangePass.email);
          expect(res.body.data.token).toBeDefined();
        })
        .expect(201);
    });

    test('(GET) when user not logged in yet', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .expect((res) => {
          expect(res.body).toBeDefined();
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    test('(GET) when user not logged in', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.email).toEqual(loginData.email);
        })
        .expect(HttpStatus.OK);
    });

    const userProfile: UserProfileDTO = {
      fullName: 'Alex Dang',
      gender: true,
      dateOfBirth: new Date('1998-03-15'),
    };
    test('(PUT) Update user profile', async () => {
      return request(app.getHttpServer())
        .put(`/api/v1/users/me`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(userProfile)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.fullName).toEqual(userProfile.fullName);
        })
        .expect(HttpStatus.OK);
    });

    const userPass: ChangePasswordDTO = {
      newPassword: 'Admin1234',
      password: 'Admin123',
    };
    test('(PUT) Change password', async () => {
      return request(app.getHttpServer())
        .put(`/api/v1/users/me/change_password`)
        .set('Authorization', `Bearer ${userTokenChangePass}`)
        .send(userPass)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('User information', () => {
    test('(GET) Get user active', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users?status=${Status.ACTIVE}&page=1&limit=10`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
    test('(GET) Search user active', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users?status=${Status.ACTIVE}&page=1&text=duc&limit=10`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get user pending', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users?status=${Status.PENDING}&page=1&limit=10`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
    test('(GET) Search user pending', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users?status=${Status.PENDING}&page=1&text=duc&limit=10`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get user deactive', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users?status=${Status.DEAVCTIVE}&page=1&limit=10`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
    test('(GET) Search user deactive', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users?status=${Status.DEAVCTIVE}&page=1&text=duc&limit=10`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get all users', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/all`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get admin', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/admin`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    const userProfile: UserDTO = {
      teamId: 1,
      email: 'phanduc0908@gmail.com',
      isActive: true,
      isApproved: true,
      isLeader: false,
      jobPositionId: 1,
      roleId: 3,
    };
    test('(PUT) Update user information', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/users/4`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(userProfile)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    const approveRequest: ApproveRequestDTO = {
      id: [9],
    };
    test('(PUT) Approve request', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/users/approve_request`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(approveRequest)
        .expect(HttpStatus.OK);
    });

    test('(DELETE) Delete user', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/users/3000`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('Reset password', () => {
    const resetPass: ResetPasswordDTO = {
      email: 'phanduc0908@gmail.com',
    };
    test('(POST) Send request', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/reset_password`)
        .send(resetPass)
        .expect((res) => expect(res.body).toBeDefined());
    });

    test('(POST) Send request with email dose not exist', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/reset_password`)
        .send({ email: 'demo@gmail.com' })
        .expect((res) => expect(res.body).toBeDefined());
    });

    test('(GET) Verify token', () => {
      return request(app.getHttpServer()).get(`/api/v1/reset_password/tokenasd`).send(resetPass).expect(413);
    });

    const newPassword: PasswordDTO = {
      password: 'Admin123',
      token: 'token',
    };
    test('(PUT) Reset password password', () => {
      return request(app.getHttpServer()).put(`/api/v1/reset_password`).send(newPassword).expect(413);
    });
  });
});
