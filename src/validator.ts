import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Type,
  INestApplication,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype: meta }: ArgumentMetadata) {
    if (!meta || !this.toValidate(meta)) {
      return value;
    }
    const object = plainToClass(meta, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid request');
    }
    return value;
  }

  private toValidate(meta: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(meta);
  }
}

export function setup(app: INestApplication): INestApplication {
  app.useGlobalPipes(new ValidationPipe());

  return app;
}
