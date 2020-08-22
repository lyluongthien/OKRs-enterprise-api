import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { CycleDTO } from '../cycle.dto';

describe('CycleController', () => {
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

  describe('GET CURRENT CYCLE', () => {
    test('Wrong URL API', async () => {
      return request(app.getHttpServer()).get('/api/v1/cyclesXYZ').expect(404);
    });

    test('Unauthorized', async () => {
      return request(app.getHttpServer()).get('/api/v1/cycles/current').expect(HttpStatus.UNAUTHORIZED);
    });

    test('(GET) crrent cycle', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cycles/current')
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CYCLE BY PAGE SIZE', () => {
    test('(GET) first page without authentication', async () => {
      return request(app.getHttpServer()).get('/api/v1/cycles').expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) bad request params', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/cycles')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
    test('(GET) crrent cycle', async () => {
      const page = 1;
      const limit = 3;
      return request(app.getHttpServer())
        .get(`/api/v1/cycles?page=${page}&limit=${limit}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CYCLE DETAIL', () => {
    const cycleId = 1;
    test('(GET) cycle detail without authentication', async () => {
      return request(app.getHttpServer()).get(`/api/v1/cycles/${cycleId}`).expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) Authorization when users are not admin', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });
    test('(GET) crrent cycle', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toEqual(cycleId);
        })
        .expect(HttpStatus.OK);
    });
  });

  let createCycleId: number;
  describe('CREATE CYCLE', () => {
    const cycleData: CycleDTO = {
      name: 'Test demo cycle summer',
      startDate: new Date('2020-01-02'),
      endDate: new Date('2020-03-04'),
    };
    test('(POST) Create new cycle', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cycles`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(cycleData)
        .expect((res) => {
          createCycleId = res.body.data.id;
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toEqual(cycleData.name);
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('UPDATE CYCLE', () => {
    const cycleUpdate: CycleDTO = {
      name: 'Update name cycle name',
      startDate: new Date('2020-01-13'),
      endDate: new Date('2020-03-24'),
    };
    test('(PUT) Create new cycle', async () => {
      return request(app.getHttpServer())
        .put(`/api/v1/cycles/${createCycleId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(cycleUpdate)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toEqual(cycleUpdate.name);
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('DELETE CYCLE', () => {
    test('(DELETE) cycle by id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/cycles/${createCycleId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });
});
