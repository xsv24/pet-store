import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "ts-results";
import { Pet, PetEntity } from "./pet.entity";

export interface IPetMap { 
    [id: string] : PetEntity;
}

export enum Errors {
    NotFound
}

@Injectable()
export class PetService {
    constructor(private readonly pets: IPetMap = {}) {}

    get(id: string) : Result<PetEntity, Errors> {
        const pet = this.pets[id];
        return pet ? Ok(pet) : Err(Errors.NotFound)
    }

    getAll() : PetEntity[] {
        return Object.values(this.pets);
    }

    update(id: string, pet: Pet) : Result<PetEntity, Errors> {
        const existing = this.pets[id];

        if (!existing) return Err(Errors.NotFound);

        var entity = new PetEntity(pet, id);
        this.pets[id] = entity;

        return Ok(entity);
    }

    add(pet: Pet) : PetEntity {
        const entity = new PetEntity(pet);
        this.pets[entity.id] = entity;

        return entity;
    }

    delete(id: string) : Result<undefined, Errors> {
        if (!this.pets[id]) return Err(Errors.NotFound);

        delete this.pets[id];

        return Ok(undefined);
    }
}