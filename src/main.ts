import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    //setting up gloabal valudation pipe
    whitelist:true//only allow that propertis that are requird in body or mentioned in dto
  }))
  await app.listen(3000);
}
bootstrap();
