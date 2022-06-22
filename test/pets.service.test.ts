import { randomUUID } from "crypto";
import { Pet, PetEntity } from "../src/pets/pet.entity";
import { IPetMap, PetService } from "../src/pets/pets.service";

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
        service.add(pet);

        // Assert
        const pets = Object.values(map);
        const entity : PetEntity = new PetEntity(pet, pets[0].id);
        const expected: PetEntity[] = [ entity ];

        expect(pets).toStrictEqual(expected);
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
            expect(pet).toStrictEqual(expected);
        });

        it('if not pet is found undefined is returned', () => {
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
            const pet = service.get(randomUUID());
            
            // Assert
            expect(pet).toStrictEqual(undefined);
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

    describe('sell a pet', () => {

        it('sell a pet with the specified id', () => {
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
            service.delete(expected.id);
            
            // Assert
            expect(map[expected.id]).toBe(undefined);
        });

        it('attempting to sell a pet that is already sold returns already sold status', () => {
            // TODO: have delete return an enum to specify success | error of deletion.
        });
    });
});