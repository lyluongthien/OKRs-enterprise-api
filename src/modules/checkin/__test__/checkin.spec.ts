import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { CHECKIN_FOBIDDEN } from '@app/constants/app.exeption';

describe('EvaluationCriteriaController', () => {
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
  const adminData: SignInDTO = {
    email: 'quangnvse05839@fpt.edu.vn',
    password: 'Admin123',
  };
  let userToken: string;
  let admintoken: string;

  describe('LOGIN SYSTEM', () => {
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
  });

  describe('LOGIN SYSTEM ADMIN', () => {
    test('(POST) Login succes', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send(adminData)
        .expect((res) => {
          admintoken = res.body.data.token;
          expect(res.body.data).toBeDefined();
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.user.email).toEqual(adminData.email);
          expect(res.body.data.token).toBeDefined();
        })
        .expect(201);
    });
  });

  describe('WRONG API', () => {
    test('Wrong URL API', async () => {
      return request(app.getHttpServer()).get('/api/v1/checkinsXYZ').expect(404);
    });

    test('Unauthorized', async () => {
      return request(app.getHttpServer()).get('/api/v1/checkins').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET CHECKIN BY PAGE SIZE', () => {
    test('(GET) first page without authentication', async () => {
      return request(app.getHttpServer()).get('/api/v1/checkins').expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) bad request params', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CYCLE DETAIL', () => {
    const checkinId = 1;
    test('(GET) evaluation criterias detail without authentication', async () => {
      return request(app.getHttpServer()).get(`/api/v1/checkins/${checkinId}`).expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) detail evaluation criterias', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/checkins/${checkinId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect(CHECKIN_FOBIDDEN.statusCode);
    });
  });
});
