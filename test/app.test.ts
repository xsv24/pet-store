import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PetModule } from '../src/pet/pet.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PetModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/pets (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/pets')
      .expect(200)
      .expect([]);
  });
});
