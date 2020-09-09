import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';

describe('DashboardController', () => {
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

  describe('GET TOP STAR', () => {
    test('(GET) top star send', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/dashboard/top_stars?cycleId=3&type=1`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) top star received', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/dashboard/top_stars?cycleId=3&type=2`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('VIEW PROGRESS', () => {
    test('(GET) OKRs progress', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/dashboard/view_progress?cycleId=3`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('VIEW DASHBOARd ADMIN', () => {
    test('(GET) Checkin status', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/dashboard/checkin_status`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) CFRs status', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/dashboard/cfr_status`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) OKRs status', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/dashboard/okr_status`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });
});
