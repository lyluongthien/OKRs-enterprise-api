import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { TeamDTO } from '../team.dto';

describe('TeamController', () => {
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
      return request(app.getHttpServer()).get('/api/v1/teamsXYZ').expect(404);
    });

    test('Unauthorized', async () => {
      return request(app.getHttpServer()).get('/api/v1/teams').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET DATA BY PAGE SIZE', () => {
    test('(GET) first page without authentication', async () => {
      return request(app.getHttpServer()).get('/api/v1/teams').expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) me by page', async () => {
      const page = 1;
      const limit = 3;
      return request(app.getHttpServer())
        .get(`/api/v1/teams?page=${page}&limit=${limit}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('GET TEAM DETAIL', () => {
    const teamId = 1;
    test('(GET) measure detail without authentication', async () => {
      return request(app.getHttpServer()).get(`/api/v1/teams/${teamId}`).expect(HttpStatus.UNAUTHORIZED);
    });
    test('(GET) detail teams', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/teams/${teamId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toEqual(teamId);
        })
        .expect(HttpStatus.OK);
    });
  });

  let createDataId: number;
  describe('CREATE TEAM', () => {
    const createData: TeamDTO = {
      name: 'Demo team',
      description: 'Demo team',
    };
    test('(POST) Create new team', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/teams`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(createData)
        .expect((res) => {
          createDataId = res.body.data.id;
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toEqual(createData.name);
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('UPDATE', () => {
    const updateData: TeamDTO = {
      name: 'Demo team 123',
      description: 'Demo team 123',
    };
    test('(PUT) Update measure unit', async () => {
      return request(app.getHttpServer())
        .put(`/api/v1/teams/${createDataId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(updateData)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toEqual(updateData.name);
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('DELETE TEAM', () => {
    test('(DELETE) by id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/teams/${createDataId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });
});
