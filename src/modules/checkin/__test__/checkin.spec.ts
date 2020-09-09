import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { INFERIOR_FORBIDEN } from '@app/constants/app.exeption';

describe('CheckinController', () => {
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
        .expect(HttpStatus.CREATED);
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
        .expect(HttpStatus.CREATED);
    });
  });

  describe('GET CHECKIN INFERIOR', () => {
    test('(GET) inferior of staff', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/inferior?cycleId=3&page=1&limit=10')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(INFERIOR_FORBIDEN.statusCode);
    });

    test('(GET) inferior admin', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/inferior?cycleId=3&page=1&limit=10')
        .set('Authorization', `Bearer ${admintoken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CHECKIN INFERIOR OBJECTIVE', () => {
    test('(GET) inferior of staff', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/inferior_objective?userId=1&cycleId=3')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CHECKIN HISTORY OBJECTIVE', () => {
    test('(GET) history checkin', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/history/11')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CHECKIN REQUEST', () => {
    test('(GET) request checkin', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/checkin_request?cycleId=3&page=1&limit=10')
        .set('Authorization', `Bearer ${admintoken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CHECKIN Admin', () => {
    test('(GET) admin checkin', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/admin?cycleId=3')
        .set('Authorization', `Bearer ${admintoken}`)
        .expect(HttpStatus.OK);
    });
    test('(GET) not admin checkin', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/admin?cycleId=3')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(INFERIOR_FORBIDEN.statusCode);
    });

    test('(GET) waiting_feedback_detail', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/waiting_feedback_detail/1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.OK);
    });

    test('(GET) get checkin detail', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins?cycleId=3')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.OK);
    });

    test('(GET) get checkin detail with invalid ID', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/23423')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    test('(GET) get checkin detail history with invalid ID', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/checkins/history/23423')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
