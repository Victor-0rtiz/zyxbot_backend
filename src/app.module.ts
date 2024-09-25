import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { ChatwsGateway } from './chatws/chatws.gateway';

@Module({
  imports: [ChatModule, UsersModule, LoginModule],
  controllers: [AppController],
  providers: [AppService, ChatwsGateway],
})
export class AppModule {}
