import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { v4 as uuid } from 'uuid';

export enum PetType {
  Cat = 'cat',
  Dog = 'dog',
  Rabbit = 'rabbit',
}

export class Pet {
  @IsEnum(PetType)
  @ApiProperty({ enum: PetType, description: 'Type of pet.' })
  type: PetType;

  @IsString()
  @ApiProperty({
    type: String,
    example: 'Joe',
    description: 'Name of the pet.',
  })
  name: string;

  @IsDateString()
  @ApiProperty({
    type: Date,
    example: '2022-06-23T08:59:34.338Z',
    description: 'Date of birth of the pet.',
  })
  dob: string;

  @IsString()
  @ApiProperty({
    type: String,
    example: 'poodle',
    description: 'species of pet type.',
  })
  species: string;
}

export class PetQuery {
  @IsOptional()
  @IsEnum(PetType)
  @ApiProperty({ enum: PetType, description: 'Type of pet.', required: false })
  type?: PetType;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Joe',
    description: 'Name of the pet.',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2022-06-23T08:59:34.338Z',
    description: 'Date of birth of the pet.',
    required: false,
  })
  dob?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'poodle',
    description: 'species of pet type.',
    required: false,
  })
  species?: string;
}

export class PetEntity extends Pet {
  @ApiProperty({ type: String, description: 'uuid for a pet' })
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
