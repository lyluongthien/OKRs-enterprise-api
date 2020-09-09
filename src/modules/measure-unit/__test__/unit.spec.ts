import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { MeasureUnitDTO } from '../measure-unit.dto';

describe('MeasureUnitController', () => {
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
        .expect(HttpStatus.CREATED);
    });
  });

  describe('WRONG API', () => {
    test('Wrong URL API', async () => {
      return request(app.getHttpServer()).get('/api/v1/measure_unitsXYZ').expect(404);
    });

    test('Unauthorized', async () => {
      return request(app.getHttpServer()).get('/api/v1/measure_units').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET DATA BY PAGE SIZE', () => {
    test('(GET) first page without authentication', async () => {
      return request(app.getHttpServer()).get('/api/v1/measure_units').expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) me by page', async () => {
      const page = 1;
      const limit = 3;
      return request(app.getHttpServer())
        .get(`/api/v1/measure_units?page=${page}&limit=${limit}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('GET measure DETAIL', () => {
    const measureId = 1;
    test('(GET) measure detail without authentication', async () => {
      return request(app.getHttpServer()).get(`/api/v1/measure_units/${measureId}`).expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) detail measure_units', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/measure_units/${measureId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toEqual(measureId);
        })
        .expect(HttpStatus.OK);
    });
  });

  let createDataId: number;
  describe('CREATE measure', () => {
    const createData: MeasureUnitDTO = {
      index: 10,
      preset: '@@@',
      type: 'Demo tye',
    };
    test('(POST) Create new measure', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/measure_units`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(createData)
        .expect((res) => {
          createDataId = res.body.data.id;
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.preset).toEqual(createData.preset);
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('UPDATE', () => {
    const updateData: MeasureUnitDTO = {
      index: 10,
      preset: '@@@',
      type: 'Demo tye',
    };
    test('(PUT) Update measure unit', async () => {
      return request(app.getHttpServer())
        .put(`/api/v1/measure_units/${createDataId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(updateData)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.preset).toEqual(updateData.preset);
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('DELETE measure', () => {
    test('(DELETE) by id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/measure_units/${createDataId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });
});
