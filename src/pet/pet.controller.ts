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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { parseUUID } from '../validator';
import { Pet, PetEntity, PetQuery } from './pet.entity';
import { Errors, PetService } from './pet.service';

@ApiTags('pets')
@Controller('v1/pets')
export class PetController {
  constructor(private readonly pets: PetService) {}

  @Get('/up')
  @ApiOperation({ summary: 'Simple health check of the service' })
  @ApiResponse({ status: 200, description: 'If up and running.' })
  up() {
    return 'We are up an running!';
  }

  @Post()
  @ApiOperation({ summary: 'Add a pet to the pet store registry' })
  @ApiBody({ type: Pet })
  @ApiResponse({ status: 201, type: PetEntity })
  @ApiResponse({ status: 400, description: 'On an invalid request' })
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  post(@Body() body: Pet): PetEntity {
    return this.pets.add(body);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Attempt to update an existing pet to the store registry',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique pet identifier',
    example: randomUUID(),
  })
  @ApiBody({ type: Pet })
  @ApiResponse({ status: 200, type: PetEntity })
  @ApiResponse({ status: 400, description: 'On an invalid request' })
  @ApiResponse({
    status: 404,
    description: 'When pet not found by provided "id".',
  })
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  put(@Param('id', parseUUID()) id: string, @Body() body: Pet): PetEntity {
    const updated = this.pets.update(id, body);

    if (updated.err) throw this.intoHttpError(updated.val);

    return updated.expect('Failed to update pet.');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Attempt to fetch a pet from store registry' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique pet identifier',
    example: randomUUID(),
  })
  @ApiResponse({ status: 200, type: PetEntity })
  @ApiResponse({ status: 400, description: 'On an invalid request' })
  @ApiResponse({
    status: 404,
    description: 'When pet not found by provided "id".',
  })
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  get(@Param('id', parseUUID()) id: string): PetEntity {
    const pet = this.pets.get(id);

    if (pet.err) throw this.intoHttpError(pet.val);

    return pet.expect('Failed to fetch a pet.');
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all pets from store registry' })
  @ApiResponse({ status: 200, type: Array<PetEntity> })
  @ApiResponse({ status: 400, description: 'On an invalid request' })
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  filter(@Query() query?: PetQuery): PetEntity[] {
    return this.pets.filter(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Attempt to remove a pet from the store registry' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique pet identifier',
    example: randomUUID(),
  })
  @ApiResponse({ status: 200, description: 'On a successful deletion.' })
  @ApiResponse({ status: 400, description: 'On an invalid request' })
  @ApiResponse({
    status: 404,
    description: 'When pet not found by provided "id".',
  })
  @ApiResponse({ status: 500, description: 'On unknown internal server error' })
  delete(@Param('id', parseUUID()) id: string) {
    const deleted = this.pets.delete(id);

    if (deleted.err) throw this.intoHttpError(deleted.val);
  }

  intoHttpError(error: Errors): HttpException {
    switch (error) {
      case Errors.NotFound:
        return new HttpException('Pet not found', HttpStatus.NOT_FOUND);
      default:
        return new HttpException('Internal server error occurred', 500);
    }
  }
}
