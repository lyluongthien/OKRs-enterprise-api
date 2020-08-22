import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { EvaluationDTO } from '../evaluation-criteria.dto';
import { EvaluationCriteriaEnum } from '@app/constants/app.enums';

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
      return request(app.getHttpServer()).get('/api/v1/evaluation_criteriasXYZ').expect(404);
    });

    test('Unauthorized', async () => {
      return request(app.getHttpServer()).get('/api/v1/evaluation_criterias').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET EVALUATION BY PAGE SIZE', () => {
    test('(GET) first page without authentication', async () => {
      return request(app.getHttpServer()).get('/api/v1/evaluation_criterias').expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) bad request params', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/evaluation_criterias')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
    test('(GET) evaluation by page', async () => {
      const page = 1;
      const limit = 3;
      return request(app.getHttpServer())
        .get(`/api/v1/evaluation_criterias?page=${page}&limit=${limit}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('GET CYCLE DETAIL', () => {
    const evalId = 1;
    test('(GET) evaluation criterias detail without authentication', async () => {
      return request(app.getHttpServer()).get(`/api/v1/evaluation_criterias/${evalId}`).expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) Authorization when users are not admin', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/evaluation_criterias/${evalId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });
    test('(GET) detail evaluation criterias', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/evaluation_criterias/${evalId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toEqual(evalId);
        })
        .expect(HttpStatus.OK);
    });
  });

  let createDataId: number;
  describe('CREATE EVALUATION CRITERIA', () => {
    const cycleData: EvaluationDTO = {
      content: 'Demo conent',
      numberOfStar: 20,
      type: EvaluationCriteriaEnum.LEADER_TO_MEMBER,
    };
    test('(POST) Create new evaluation criterias', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/evaluation_criterias`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(cycleData)
        .expect((res) => {
          createDataId = res.body.data.id;
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.content).toEqual(cycleData.content);
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('UPDATE', () => {
    const cycleData: EvaluationDTO = {
      content: 'Demo conent 123',
      numberOfStar: 22,
      type: EvaluationCriteriaEnum.LEADER_TO_MEMBER,
    };
    test('(PUT) Create new cycle', async () => {
      return request(app.getHttpServer())
        .put(`/api/v1/evaluation_criterias/${createDataId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(cycleData)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.content).toEqual(cycleData.content);
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('DELETE EVALUATION CRITERIA', () => {
    test('(DELETE) by id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/evaluation_criterias/${createDataId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });
});
