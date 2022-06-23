import { ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

enum PetType {
  Cat = 'cat',
  Dog = 'dog',
  Rabbit = 'rabbit'
}

export class Pet {
  @ApiProperty({ enum: PetType, description: "Type of pet."  })
  type: PetType;

  @ApiProperty({ type: String, example: 'Joe', description: 'Name of the pet.' })
  name: string;

  @ApiProperty({ type: Date, example: '', description: 'Date of birth of the pet.' })
  dob: Date;

  @ApiProperty({ type: String, example: 'poodle', description: 'species of pet type.' })
  species: string;
}

export class PetQuery {
  @ApiProperty({ enum: PetType, description: "Type of pet.", required: false })
  type?: PetType;
  
  @ApiProperty({ type: String, example: 'Joe', description: 'Name of the pet.', required: false })
  name?: string;
  
  @ApiProperty({ example: '', description: 'Date of birth of the pet.', required: false })
  dob?: Date;
  
  @ApiProperty({ example: 'poodle', description: 'species of pet type.', required: false })
  species?: string;
}

export class PetEntity extends Pet {
  @ApiProperty({ type: String, description: "uuid for a pet" })
  id: string;

  constructor(pet: Pet, id: string = uuid()) {
    super();
    this.id = id;
    this.dob = pet.dob;
    this.name = pet.name;
    this.species = pet.species;
    this.type = pet.type;
  }
}
