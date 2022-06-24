import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PetModule } from './pet/pet.module';
import { setup } from './validator';

async function bootstrap() {
  const app = setup(await NestFactory.create(PetModule));

  const config = new DocumentBuilder()
    .setTitle('Pet store')
    .setDescription('Pet store API spec')
    .setVersion('1.0')
    .addTag('pets')
    .build();

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));

  await app.listen(3000);
}
bootstrap();
