import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { ChatwsGateway } from './chatws/chatws.gateway';
import { UnanManaguaGateway } from './sockets/unan-managua/unan-managua.gateway';

import { CasimiroGateway } from './sockets/casimiro/casimiro.gateway';
import { MapaInteractivoModule } from './mapa-interactivo/mapa-interactivo.module';
import { ConfigModule } from '@nestjs/config';
import { CurMatGateway } from './sockets/cur-mat/cur-mat.gateway';
import { AutentificationModule } from './autentification/autentification.module';


@Module({
  imports: [ ConfigModule.forRoot(), UsersModule, LoginModule, MapaInteractivoModule, AutentificationModule],
  controllers: [AppController],
  providers: [AppService, ChatwsGateway, UnanManaguaGateway, CasimiroGateway, CurMatGateway],
})
export class AppModule {}
