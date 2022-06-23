import { randomUUID } from 'crypto';
import { Pet, PetEntity } from '../src/pets/pet.entity';
import { Errors, IPetMap, PetService } from '../src/pets/pets.service';

describe('PetService', () => {
  let map: IPetMap;

  beforeEach(() => {
    map = {};
  });

  it('persist a pet', () => {
    // Arrange
    const service = new PetService(map);

    const pet: Pet = {
      name: '',
      dob: new Date(),
      species: '',
      type: 'dog',
    };

    // Act
    const entity = service.add(pet);

    // Assert
    expect(map[entity.id]).toStrictEqual(entity);
  });

  describe('update an existing pet', () => {
    it('update a pet by id', () => {
      // Arrange
      const existing: PetEntity = {
        id: randomUUID(),
        name: '',
        dob: new Date(),
        species: '',
        type: 'dog',
      };

      map[existing.id] = existing;

      const service = new PetService(map);

      const pet: Pet = {
        name: 'joe',
        dob: new Date(),
        species: '',
        type: 'cat',
      };

      // Act
      const updated = service.update(existing.id, pet);

      // Act
      const expected = new PetEntity(pet, existing.id);
      expect(updated.val).toStrictEqual(expected);
      expect(map[existing.id]).toStrictEqual(expected);
    });
  });

  describe('get a pet', () => {
    it('fetches a pet based on pets id', () => {
      // Arrange
      const expected: PetEntity = {
        id: randomUUID(),
        name: '',
        dob: new Date(),
        species: '',
        type: 'dog',
      };

      map[expected.id] = expected;

      const service = new PetService(map);

      // Act
      const pet = service.get(expected.id);

      // Assert
      expect(pet.val).toStrictEqual(expected);
    });

    it('if not pet is not found an error result is returned', () => {
      // Arrange
      const expected: PetEntity = {
        id: randomUUID(),
        name: '',
        dob: new Date(),
        species: '',
        type: 'dog',
      };

      map[expected.id] = expected;

      const service = new PetService(map);

      // Act
      const error = service.get(randomUUID()).val;

      // Assert
      expect(error).toStrictEqual(Errors.NotFound);
    });
  });

  describe('filter', () => {
    it('without a query all object values of pet map are returned', () => {
      // Arrange
      const expected: PetEntity = {
        id: randomUUID(),
        name: '',
        dob: new Date(),
        species: '',
        type: 'dog',
      };

      map[expected.id] = expected;

      const service = new PetService(map);

      // Act
      const pets = service.filter();

      // Assert
      expect(pets).toStrictEqual([expected]);
    });

    it('on an exact query match the matched pets are returned', () => {
      // Arrange
      const dog: PetEntity = {
        id: randomUUID(),
        name: 'james',
        dob: new Date(),
        species: 'poodle',
        type: 'dog',
      };

      const otherDog: PetEntity = {
        id: randomUUID(),
        name: 'billy',
        dob: new Date(),
        species: 'poodle',
        type: 'dog',
      };

      map[dog.id] = dog;
      map[otherDog.id] = otherDog;

      const service = new PetService(map);

      // Act
      const pets = service.filter({
        name: dog.name,
        dob: dog.dob,
        species: dog.species,
        type: dog.type,
      });

      // Assert
      expect(pets).toStrictEqual([dog]);
    });

    it('on an partial query match the matched pets are returned', () => {
      // Arrange
      const dog1: PetEntity = {
        id: randomUUID(),
        name: randomUUID(),
        dob: new Date(),
        species: randomUUID(),
        type: 'dog',
      };

      const dog2: PetEntity = {
        id: randomUUID(),
        name: randomUUID(),
        dob: new Date(),
        species: randomUUID(),
        type: 'dog',
      };

      const cat: PetEntity = {
        id: randomUUID(),
        name: randomUUID(),
        dob: new Date(),
        species: randomUUID(),
        type: 'cat',
      };

      map[dog1.id] = dog1;
      map[dog2.id] = dog2;
      map[cat.id] = cat;

      const service = new PetService(map);

      // Act
      const pets = service.filter({ type: 'dog' });

      // Assert
      expect(pets).toStrictEqual([dog1, dog2]);
    });

    it('on an empty pet map an empty array is returned', () => {
      // Arrange
      const service = new PetService();
      // Act
      const pets = service.filter();
      // Assert
      expect(pets).toStrictEqual([]);
    });
  });

  describe('delete a pet from the registry store', () => {
    it('delete a pet with the specified id', () => {
      // Arrange
      const expected: PetEntity = {
        id: randomUUID(),
        name: '',
        dob: new Date(),
        species: '',
        type: 'dog',
      };

      map[expected.id] = expected;

      const service = new PetService(map);

      // Act
      const result = service.delete(expected.id);

      // Assert
      expect(map[expected.id]).toBe(undefined);
      expect(result.ok).toBe(true);
    });

    it('attempting to delete an non-existing pet returns an error result', () => {
      // Arrange
      const service = new PetService();

      // Act
      const result = service.delete(randomUUID());

      // Assert
      expect(result.val).toBe(Errors.NotFound);
    });
  });
});
