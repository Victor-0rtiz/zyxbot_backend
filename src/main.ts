import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnection } from './config/dbconfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  getConnection();
}
bootstrap();
