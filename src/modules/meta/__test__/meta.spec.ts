import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';

describe('MetaController', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });
  describe('teams', () => {
    test('(GET) Test wrong path url get meta data team', async () => {
      return request(app.getHttpServer()).get('/api/v1/meta_data/teams12').expect(404);
    });
    test('(GET) Get all teams', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/meta_data/teams')
        .then((res) => {
          expect(HttpStatus.OK);
          expect(res.body.data).toBeDefined();
        });
    });
  });
  describe('job_positions', () => {
    test('(GET) Test wrong path url get meta data job position', async () => {
      return request(app.getHttpServer()).get('/api/v1/meta_data/job_positions123').expect(404);
    });
    test('(GET) Get all job position', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/meta_data/job_positions')
        .then((res) => {
          expect(HttpStatus.OK);
          expect(res.body.data).toBeDefined();
        });
    });
  });
  describe('lessons', () => {
    test('(GET) Test wrong path url get meta data lesson', async () => {
      return request(app.getHttpServer()).get('/api/v1/meta_data/lessons123').expect(404);
    });
    test('(GET) Get all lesson', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/meta_data/lessons')
        .then((res) => {
          expect(HttpStatus.OK);
          expect(res.body.data).toBeDefined();
        });
    });
  });
  describe('cycles', () => {
    test('(GET) Test wrong path url get meta data cycle', async () => {
      return request(app.getHttpServer()).get('/api/v1/meta_data/cycles123').expect(404);
    });
    test('(GET) Get all cycle', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/meta_data/cycles')
        .then((res) => {
          expect(HttpStatus.OK);
          expect(res.body.data).toBeDefined();
        });
    });
  });
  describe('evaluation_criteria', () => {
    test('(GET) Test wrong path url get meta data cycle', async () => {
      return request(app.getHttpServer()).get('/api/v1/meta_data/evaluation_criteria123').expect(404);
    });
    test('(GET) Get all evaluation criteria', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/meta_data/evaluation_criteria')
        .then((res) => {
          expect(HttpStatus.OK);
          expect(res.body.data).toBeDefined();
        });
    });
  });
  describe('roles', () => {
    test('(GET) Test wrong path url get meta data role', async () => {
      return request(app.getHttpServer()).get('/api/v1/meta_data/roles123').expect(404);
    });
    test('(GET) Get all role', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/meta_data/roles')
        .then((res) => {
          expect(HttpStatus.OK);
          expect(res.body.data).toBeDefined();
        });
    });
  });
});
