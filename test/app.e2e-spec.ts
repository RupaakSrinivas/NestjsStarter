import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App E2E Tests', () => {
  let app: INestApplication<App>;
  let testAccountId: number;
  let authHeader: string =
    'Basic ' + Buffer.from('fall:back').toString('base64');
  let createdSettingId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Accounts Module (/accounts)', () => {
    const testUsername = `user_${Date.now()}`;
    const testPassword = 'securePassword123';

    it('POST /accounts (Bad Request - Empty Payload)', () => {
      return request(app.getHttpServer())
        .post('/accounts')
        .send({})
        .expect(400);
    });

    it('POST /accounts (Bad Request - Short Password)', () => {
      return request(app.getHttpServer())
        .post('/accounts')
        .send({ name: testUsername, password: '123' })
        .expect(400);
    });

    it('POST /accounts (Create successfully)', async () => {
      const response = await request(app.getHttpServer())
        .post('/accounts')
        .send({ name: testUsername, password: testPassword })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testUsername);
      testAccountId = response.body.id;
      authHeader =
        'Basic ' +
        Buffer.from(`${testUsername}:${testPassword}`).toString('base64');
    });

    it('GET /accounts (No Auth)', () => {
      return request(app.getHttpServer()).get('/accounts').expect(401);
    });

    it('GET /accounts (Bad Auth - Unknown User)', () => {
      return request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', 'Basic YmFkdXNlcjpiYWRwYXNz')
        .expect(404);
    });

    it('GET /accounts (Bad Auth - Wrong Password)', () => {
      const badAuth =
        'Basic ' + Buffer.from(`${testUsername}:wrong`).toString('base64');
      return request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', badAuth)
        .expect(404);
    });

    it('GET /accounts (Correct Auth)', async () => {
      const response = await request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', authHeader)
        .expect(200);

      expect(response.body.id).toBe(testAccountId);
      expect(response.body.name).toBe(testUsername);
    });
  });

  describe('Settings Module (/settings)', () => {
    it('POST /settings (No Auth)', () => {
      return request(app.getHttpServer())
        .post('/settings')
        .send({ name: 'TEST_SETTING', data_type: 'string', value: 'hello' })
        .expect(401);
    });

    it('POST /settings (Bad Request - Data Type Mismatch)', () => {
      return request(app.getHttpServer())
        .post('/settings')
        .set('Authorization', authHeader)
        .send({
          name: 'TEST_SETTING',
          data_type: 'number',
          value: 'notanumber',
        })
        .expect(400);
    });

    it('POST /settings (Create successfully)', async () => {
      const response = await request(app.getHttpServer())
        .post('/settings')
        .set('Authorization', authHeader)
        .send({ name: 'THEME_COLOR', data_type: 'string', value: 'dark' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('THEME_COLOR');
      expect(response.body.value).toBe('dark');
      createdSettingId = response.body.id;
    });

    it('GET /settings (Correct Auth)', async () => {
      const response = await request(app.getHttpServer())
        .get('/settings')
        .set('Authorization', authHeader)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      const setting = response.body.find((s: any) => s.id === createdSettingId);
      expect(setting).toBeDefined();
    });

    it('GET /settings/:id (Correct Auth)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/settings/${createdSettingId}`)
        .set('Authorization', authHeader)
        .expect(200);

      expect(response.body.id).toBe(createdSettingId);
      expect(response.body.name).toBe('THEME_COLOR');
      expect(response.body.value).toBe('dark');
    });
  });
});
