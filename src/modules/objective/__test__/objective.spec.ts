import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { ObjectiveDTO, OkrsDTO } from '../objective.dto';
import { KeyResultDTO } from '@app/modules/keyresult/keyresult.dto';

describe('ObjectvieController', () => {
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
  let userId: number;

  describe('LOGIN SYSTEM', () => {
    test('(POST) Login succes', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set('Accept', 'application/json')
        .send(loginData)
        .expect((res) => {
          userToken = res.body.data.token;
          userId = res.body.data.id;
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

  describe('GET LIST OKRS', () => {
    test('(GET) Get root OKRs', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/list_okrs?cycleId=3&type=1`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get team OKRs', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/list_okrs?cycleId=3&type=2`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get all OKRs', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/list_okrs?cycleId=3&type=3`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get OKRs by user id', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/list_okrs/3`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('SEARCH OKRs', () => {
    test('(GET) Get OKRs by user id', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/search?cycleId=3&userId=3`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) view_list by user id', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/view_list?cycleId=3&userId=3`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) view_list by user id admin', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/view_list?cycleId=3&userId=3`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get detail OKRs by id', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/detail/1`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Get detail OKRs by id not found', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/detail/12222`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('CREATE OKRs', () => {
    const objectiveData: ObjectiveDTO = {
      userId: userId,
      cycleId: 3,
      title: 'Mua Ô tô Vinfast',
      progress: 0,
      isRootObjective: false,
      alignObjectivesId: null,
      parentObjectiveId: null,
    };
    const krData: KeyResultDTO = {
      content: 'Test',
      measureUnitId: 1,
      objectiveId: 1,
      progress: 0,
      startValue: 0,
      targetValue: 100,
      valueObtained: 0,
      linkPlans: null,
      linkResults: null,
    };
    const krData1: KeyResultDTO = {
      content: 'Test',
      measureUnitId: 1,
      objectiveId: 1,
      progress: 0,
      startValue: 0,
      targetValue: 100,
      valueObtained: 0,
      linkPlans: null,
      linkResults: null,
    };
    const okrData: OkrsDTO = {
      objective: objectiveData,
      keyResult: [krData, krData1],
    };

    let objectiveId: number;
    let keyresultId: number;

    test('(POST) Create OKRs', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/objectives`)
        .set('Authorization', `Bearer ${userToken}`)
        .set('Accept', 'application/json')
        .send(okrData)
        .expect((res) => {
          objectiveId = res.body.data;
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.CREATED);
    });

    test('(GET) Get created OKRs', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/objectives/detail/${objectiveId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          keyresultId = res.body.data.keyResults[0].id;
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(DELTE) delete keyresult', async () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/key_results/${keyresultId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(DELETE) delete OKRs', async () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/objectives/${objectiveId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });
  });
});
