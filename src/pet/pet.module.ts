import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

@Module({
  imports: [],
  controllers: [PetController],
  // We use a factory to allow for a default pet map to make unit testing easier.
  providers: [{ provide: PetService, useFactory: () => new PetService() }],
})
export class PetModule {}
