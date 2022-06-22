import { v4 as uuid } from 'uuid';

type PetType = 'cat' | 'dog' | 'rabbit';

export class Pet {
    id: string;
    type: PetType;
    name: string;
    dob: Date;
    species: string;
}

export class PetEntity extends Pet {
    id: string;

    constructor(pet: Pet) {
        super();
        this.id = uuid();
        this.dob = pet.dob;
        this.name = pet.name;
        this.species = pet.species;
        this.type = pet.type;
    }
}
