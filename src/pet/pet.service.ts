import { Injectable } from '@nestjs/common';
import { compare, sameDay } from '../validator';
import { Result, Ok, Err } from 'ts-results';
import { Pet, PetEntity, PetQuery } from './pet.entity';

export interface IPetMap {
  [id: string]: PetEntity;
}

export enum Errors {
  NotFound,
}

@Injectable()
export class PetService {
  constructor(private readonly pets: IPetMap = {}) {}

  get(id: string): Result<PetEntity, Errors> {
    const pet = this.pets[id];
    return pet ? Ok(pet) : Err(Errors.NotFound);
  }

  filter(query?: PetQuery): PetEntity[] {
    return Object.values(this.pets).filter(
      (pet) =>
        (!query?.type || pet.type === query.type) &&
        (!query?.dob || sameDay(pet.dob, query.dob)) && // TODO: Would probably have a date range match instead.
        (!query?.name || compare(pet.name, query.name)) &&
        (!query?.species || compare(pet.species, query.species)),
    );
  }

  update(id: string, pet: Pet): Result<PetEntity, Errors> {
    const existing = this.pets[id];

    if (!existing) return Err(Errors.NotFound);

    const entity = new PetEntity(pet, id);
    this.pets[id] = entity;

    return Ok(entity);
  }

  add(pet: Pet): PetEntity {
    const entity = new PetEntity(pet);
    this.pets[entity.id] = entity;

    return entity;
  }

  delete(id: string): Result<undefined, Errors> {
    if (!this.pets[id]) return Err(Errors.NotFound);

    delete this.pets[id];

    return Ok(undefined);
  }
}
