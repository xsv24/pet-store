import { Injectable } from "@nestjs/common";
import { Pet, PetEntity } from "./pet.entity";

export interface IPetMap { 
    [id: string] : PetEntity;
}

@Injectable()
export class PetService {
    constructor(private readonly pets: IPetMap = {}) {}

    get(id: string) : PetEntity | undefined {
        return this.pets[id];
    }

    getAll() : PetEntity[] {
        return Object.values(this.pets);
    }

    add(pet: Pet) : PetEntity {
        const entity = new PetEntity(pet);
        this.pets[entity.id] = entity;

        return entity;
    }

    delete(id: string) {
        // TODO: Add a pet status 'sold' or 'for_sale' rather to keep transaction history.
        delete this.pets[id];
    }
}