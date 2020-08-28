import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { UserProfileDTO, ChangePasswordDTO } from '../user.dto';

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
});
