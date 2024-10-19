import { Module } from '@nestjs/common';
import { MapaInteractivoService } from './mapa-interactivo.service';
import { MapaInteractivoController } from './mapa-interactivo.controller';

@Module({
  controllers: [MapaInteractivoController],
  providers: [MapaInteractivoService],
})
export class MapaInteractivoModule {}
