import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { MapaInteractivoService } from './mapa-interactivo.service';
import { CreateMapaInteractivoDto } from './dto/create-mapa-interactivo.dto';
import { UpdateMapaInteractivoDto } from './dto/update-mapa-interactivo.dto';
import { Response } from 'express';

@Controller('mapa-interactivo')
export class MapaInteractivoController {
  constructor(private readonly mapaInteractivoService: MapaInteractivoService) { }


  @Post()
  async getInformation1(@Body() dataBody: any, @Res() res: Response) {


    try {
      const data = await this.mapaInteractivoService.getInformation1(dataBody);

      res.status(200).json({ message: 'Solicitud creada con exito', data, status: 1 });
      return;
    } catch (error) {
      res.status(400).json({ message: 'error al crear la solicitud', status: 0 });
      return;
    }
    // return this.mapaInteractivoService.create(createMapaInteractivoDto);
  }



  @Post()
  async getInformation2(@Body() dataBody: any, @Res() res: Response) {


    try {
      const data = await this.mapaInteractivoService.getInformation2(dataBody);

      res.status(200).json({ message: 'Solicitud creada con exito', data, status: 1 });
      return;
    } catch (error) {
      res.status(400).json({ message: 'error al crear la solicitud', status: 0 });
      return;
    }
    // return this.mapaInteractivoService.create(createMapaInteractivoDto);
  }

  
}
