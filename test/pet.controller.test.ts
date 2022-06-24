import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { PetModule } from '../src/pet/pet.module';
import { randomUUID } from 'crypto';
import { PetEntity } from '../src/pet/pet.entity';
import { setup } from '../src/validator';

describe('PetController (e2e)', () => {
  let app: INestApplication;
  let server: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PetModule],
    }).compile();

    app = setup(moduleFixture.createNestApplication());
    await app.init();
    server = supertest(app.getHttpServer());
  });

  afterEach(() => {
    app.close();
  });

  describe('/pets (POST)', () => {
    it('Pet is created on post', async () => {
      // Arrange
      const req = fakePet();

      // Act
      const res = await server.post('/v1/pets').send(req).expect(201);

      const response = { id: res.body.id, ...req };
      expect(res.body).toStrictEqual(response);

      // Assert
      await server.get(`/v1/pets/${res.body.id}`).expect(200).expect(response);

      await server.get(`/v1/pets`).expect(200).expect([response]);
    });

    it('On invalid pet type a 400 error is returned', async () => {
      // Arrange
      const req = { ...fakePet(), type: 'invalid' };
      // Act & Assert
      await server.post('/v1/pets').send(req).expect(400);
    });

    it('On invalid dob type a 400 error is returned', async () => {
      // Arrange
      const req = { ...fakePet(), dob: 'invalid_date' };
      // Act & Assert
      await server.post('/v1/pets').send(req).expect(400);
    });

    it('On invalid name a 400 error is returned', async () => {
      // Arrange
      const req = { ...fakePet(), name: '' };
      // Act & Assert
      await server.post('/v1/pets').send(req).expect(400);
    });

    it('On invalid species a 400 error is returned', async () => {
      // Arrange
      const req = { ...fakePet(), species: '' };
      // Act & Assert
      await server.post('/v1/pets').send(req).expect(400);
    });
  });

  describe('/pets (GET)', () => {
    it('existing pets are fetched', async () => {
      // Arrange
      const dog = await PostPet(server, { ...fakePet(), type: 'dog' });
      const cat = await PostPet(server, { ...dog, type: 'cat' });
      const rabbit = await PostPet(server, { ...dog, type: 'rabbit' });

      // Act & Assert
      await server.get('/v1/pets').expect(200).expect([dog, cat, rabbit]);
    });

    it('existing pets are filtered on query', async () => {
      // Arrange
      const dog = await PostPet(server, { ...fakePet(), type: 'dog' });
      const cat = await PostPet(server, { ...dog, type: 'cat' });
      const rabbit = await PostPet(server, { ...dog, type: 'rabbit' });

      // Act & Assert
      await server.get('/v1/pets').expect(200).expect([dog, cat, rabbit]);
    });

    it('if no pets found an empty array is returned', async () => {
      await server.get('/v1/pets').expect(200).expect([]);
    });
  });

  describe('/pets/:id (GET)', () => {
    it('existing pet is fetched', async () => {
      // Arrange
      const pet = await PostPet(server);

      // Act & Assert
      await server.get(`/v1/pets/${pet.id}`).expect(200).expect(pet);
    });

    it('On pet not found a 404 is returned', async () => {
      // Arrange, Act & Assert
      await server.get(`/v1/pets/${randomUUID()}`).expect(404);
    });
  });

  describe('/pets/:id (put)', () => {
    it('existing pet is updated', async () => {
      // Arrange
      const pet = await PostPet(server);

      const update = { ...pet, name: 'Bobby' };

      // Act & Assert
      await server
        .put(`/v1/pets/${pet.id}`)
        .send(update)
        .expect(200)
        .expect(update);
    });

    it('On pet not found a 404 is returned', async () => {
      // Arrange
      const req = fakePet();

      // Act & Assert
      await server.put(`/v1/pets/${randomUUID()}`).send(req).expect(404);
    });
  });

  describe('/pets/:id (delete)', () => {
    it('existing pet is deleted', async () => {
      // Arrange
      const pet = await PostPet(server);

      // Act & Assert
      await server.delete(`/v1/pets/${pet.id}`).expect(200);
    });

    it('On pet not found a 404 is returned', async () => {
      // Arrange, Act & Assert
      await server.delete(`/v1/pets/${randomUUID()}`).expect(404);
    });
  });
});

export async function PostPet(
  server: supertest.SuperTest<supertest.Test>,
  body: any = fakePet(),
): Promise<PetEntity> {
  const response = await server.post('/v1/pets').send(body).expect(201);

  return response.body as PetEntity;
}

const fakePet = () => ({
  name: 'Joe',
  type: 'dog',
  dob: new Date().toISOString(),
  species: 'species',
});
