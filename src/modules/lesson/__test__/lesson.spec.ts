import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { SignInDTO } from '@app/modules/auth/auth.dto';
import { LessonDTO } from '../lesson.dto';

describe('LessonController', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  const adminData: SignInDTO = {
    email: 'quangnvse05839@fpt.edu.vn',
    password: 'Admin123',
  };
  let admintoken: string;

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

  describe('GET DATA BY PAGE SIZE', () => {
    test('(GET) lesson', async () => {
      const page = 1;
      const limit = 3;
      return request(app.getHttpServer())
        .get(`/api/v1/lessons?page=${page}&limit=${limit}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });

    test('(GET) Search lesson', async () => {
      const page = 1;
      const limit = 3;
      return request(app.getHttpServer())
        .get(`/api/v1/lessons?page=${page}&limit=${limit}&text=abc`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });

  let createDataId: number;
  describe('CREATE LESSON', () => {
    const createData: LessonDTO = {
      title: 'Title',
      abstract: 'abstract',
      content: 'content',
      index: 10,
      slug: 'slug',
      thumbnail: 'content',
    };
    test('(POST) Create new lesson', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/lessons`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(createData)
        .expect((res) => {
          createDataId = res.body.data.id;
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('GET LESSON DETAIL', () => {
    test('(GET) detail lesson', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/lessons/abc`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    test('(GET) detail lesson', async () => {
      return request(app.getHttpServer())
        .get(`/api/v1/lessons/slug`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('UPDATE', () => {
    const updateData: LessonDTO = {
      title: 'Title 123',
      abstract: 'abstract',
      content: 'content',
      index: 10,
      slug: 'slug',
      thumbnail: 'content',
    };
    test('(PUT) Update data', async () => {
      return request(app.getHttpServer())
        .put(`/api/v1/lessons/${createDataId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .send(updateData)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.title).toEqual(updateData.title);
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('DELETE LESSON', () => {
    test('(DELETE) by id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/lessons/${createDataId}`)
        .set('Authorization', `Bearer ${admintoken}`)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toBeDefined();
        })
        .expect(HttpStatus.OK);
    });
  });
});
