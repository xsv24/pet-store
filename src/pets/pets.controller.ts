import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { Pet, PetEntity, PetQuery } from './pet.entity';
import { Errors, PetService } from './pets.service';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly pets: PetService) {}

  @Post()
  @ApiOperation({ summary: 'Add a pet to the pet store registry' })
  async post(@Body() body: Pet): Promise<PetEntity> {
    return this.pets.add(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Attempt to update an existing pet to the store registry' })
  async put(@Param('id') id: string, @Body() body: Pet) : Promise<PetEntity> {
    return this.pets.update(id, body)
        .mapErr(this.intoHttpError)
        .unwrap();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Attempt to fetch a pet from store registry' })
  async get(@Param('id') id: string): Promise<PetEntity> {
    return this.pets.get(id)
        .mapErr(this.intoHttpError)
        .unwrap();
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all pets from store registry' })
  async filter(@Query() query?: PetQuery): Promise<PetEntity[]> {
    return this.pets.filter(query);
  }

  @Delete()
  @ApiOperation({ summary: 'Attempt to remove a pet from the store registry' })
  async delete(@Param('id') id: string) {
    return this.pets.delete(id)
        .mapErr(this.intoHttpError)
        .unwrap();
  }

  intoHttpError(error: Errors) : HttpException {
    switch(error) {
        case Errors.NotFound:
            return new HttpException('Pet not found', 404)
        default:
            return new HttpException('Internal server error occurred', 500)
    }
  }
}
