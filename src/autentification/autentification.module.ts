import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AutentificationService } from './autentification.service';
import { AutentificationController } from './autentification.controller';
import { AutorizationMiddleware } from 'src/middlewares/autorization/autorization.middleware';

@Module({
  controllers: [AutentificationController],
  providers: [AutentificationService],
})
export class AutentificationModule {
  
}
