import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';

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

  let userToken: string;

  describe('GET me', () => {
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
  });
});
