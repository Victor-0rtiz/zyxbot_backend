import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnection } from './config/dbconfig';
import { AutorizationMiddleware } from './middlewares/autorization/autorization.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  getConnection();
  await app.listen(3000);

}
bootstrap();
