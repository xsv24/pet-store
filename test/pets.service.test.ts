import { randomUUID } from "crypto";
import { Ok } from "ts-results";
import { Pet, PetEntity } from "../src/pets/pet.entity";
import { Errors, IPetMap, PetService } from "../src/pets/pets.service";

describe('PetService', () => {
    let map: IPetMap;

    beforeEach(() => {
        map = {};
    });

    it('persist a pet', () => {
        // Arrange
        const service = new PetService(map);

        const pet : Pet = {
            name: '',
            dob: new Date(),
            species: '',
            type: 'dog'
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
                type: 'dog'
            };

            map[existing.id] = existing;

            const service = new PetService(map);

            const pet : Pet = {
                name: 'joe',
                dob: new Date(),
                species: '',
                type: 'cat'
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
            const expected : PetEntity = {
                id: randomUUID(),
                name: '',
                dob: new Date(),
                species: '',
                type: 'dog'
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
            const expected : PetEntity = {
                id: randomUUID(),
                name: '',
                dob: new Date(),
                species: '',
                type: 'dog'
            };

            map[expected.id] = expected;

            const service = new PetService(map);

            // Act
            const error = service.get(randomUUID()).val;
            
            // Assert
            expect(error).toStrictEqual(Errors.NotFound);
        });
    });

    describe('get all pets', () => {

        it('fetches object values of pet map', () => {
            // Arrange
            const expected : PetEntity = {
                id: randomUUID(),
                name: '',
                dob: new Date(),
                species: '',
                type: 'dog'
            };

            map[expected.id] = expected;

            const service = new PetService(map);

            // Act
            const pets = service.getAll();
            
            // Assert
            expect(pets).toStrictEqual([expected]);
        });


        it('on an empty pet map an empty array is returned', () => {
            // Arrange
            const service = new PetService();
            // Act
            const pets = service.getAll();
            // Assert
            expect(pets).toStrictEqual([]);
        });
    });

    describe('delete a pet from the registry store', () => {

        it('delete a pet with the specified id', () => {
            // Arrange
            const expected : PetEntity = {
                id: randomUUID(),
                name: '',
                dob: new Date(),
                species: '',
                type: 'dog'
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