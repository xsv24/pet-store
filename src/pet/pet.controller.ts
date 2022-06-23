import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Pet, PetEntity, PetQuery } from './pet.entity';
import { Errors, PetService } from './pet.service';

@ApiTags('pets')
@Controller('v1/pets')
export class PetController {
  constructor(private readonly pets: PetService) {}

  @Post()
  @ApiOperation({ summary: 'Add a pet to the pet store registry' })
  @ApiBody({ type: Pet })
  @ApiResponse({ status: 200, type: PetEntity })
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  async post(@Body() body: Pet): Promise<PetEntity> {
    return this.pets.add(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Attempt to update an existing pet to the store registry' })
  @ApiParam({ name: 'id', type: String, description: 'Unique pet identifier', example: randomUUID() })
  @ApiBody({ type: Pet })
  @ApiResponse({ status: 200, type: PetEntity })
  @ApiResponse({ status: 404, description: 'When pet not found by provided "id".'})
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  async put(@Param('id') id: string, @Body() body: Pet) : Promise<PetEntity> {
    const updated = this.pets.update(id, body)

    if(updated.err) throw this.intoHttpError(updated.val);

    return updated.expect('Failed to update pet.');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Attempt to fetch a pet from store registry' })
  @ApiParam({ name: 'id', type: String, description: 'Unique pet identifier', example: randomUUID() })
  @ApiResponse({ status: 200, type: PetEntity })
  @ApiResponse({ status: 404, description: 'When pet not found by provided "id".'})
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  async get(@Param('id') id: string): Promise<PetEntity> {
    const pet = this.pets.get(id)

    if(pet.err) throw this.intoHttpError(pet.val);

    return pet.expect('Failed to fetch a pet.');
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all pets from store registry' })
  @ApiResponse({ status: 200, type: Array<PetEntity> })
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  async filter(@Query() query?: PetQuery): Promise<PetEntity[]> {
    return this.pets.filter(query);
  }

  @Delete()
  @ApiOperation({ summary: 'Attempt to remove a pet from the store registry' })
  @ApiParam({ name: 'id', type: String, description: 'Unique pet identifier', example: randomUUID() })
  @ApiResponse({ status: 200, description: 'On a successful deletion.' })
  @ApiResponse({ status: 404, description: 'When pet not found by provided "id".'})
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  async delete(@Param('id') id: string) {
    const deleted = this.pets.delete(id)

    if(deleted.err) throw this.intoHttpError(deleted.val);
  }

  intoHttpError(error: Errors) : HttpException {
    switch(error) {
        case Errors.NotFound:
            return new HttpException('Pet not found', HttpStatus.NOT_FOUND)
        default:
            return new HttpException('Internal server error occurred', 500)
    }
  }
}
