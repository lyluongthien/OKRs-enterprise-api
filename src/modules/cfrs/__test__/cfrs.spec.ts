import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';

describe('CFRsController', () => {
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
  const leaderBody: SignInDTO = {
    email: 'ducnmhe130666@fpt.edu.vn',
    password: 'Admin123',
  };
  let userToken: string;
  let admintoken: string;
  let leaderToken: string;

  describe('LOGIN SYSTEM', () => {
    test('(POST) Test with empty login body', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
    test('(POST) Login leader account', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send(leaderBody)
        .expect((res) => {
          leaderToken = res.body.data.token;
          expect(res.body.data).toBeDefined();
          expect(res.body.data.user).toBeDefined();
        });
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

  describe('GET LIST WATTING', () => {
    test('(GET) list_waiting with role staff', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cfrs/list_waiting?page=1&limit=10')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.OK);
    });

    test('(GET) list_waiting with role admin', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cfrs/list_waiting?page=1&limit=10')
        .set('Authorization', `Bearer ${admintoken}`)
        .expect(HttpStatus.OK);
    });

    test('(GET) list_waiting with role leader', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cfrs/list_waiting?page=1&limit=10')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CFRs HISTORY', () => {
    test('(GET) history sent', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cfrs/history?page=1&limit=10&userId=1&cycleId=3&type=1')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(HttpStatus.OK);
    });
    test('(GET) history received', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cfrs/history?page=1&limit=10&userId=1&cycleId=3&type=2')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(HttpStatus.OK);
    });
    test('(GET) history all', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cfrs/history?page=1&limit=10&userId=1&cycleId=3&type=3')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CFRs DETAIL', () => {
    test('(GET) CFR detail', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cfrs/detail/1')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(HttpStatus.OK);
    });
  });
});
