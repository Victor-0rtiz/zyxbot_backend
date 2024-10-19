import { Injectable } from '@nestjs/common';
import { CreateMapaInteractivoDto } from './dto/create-mapa-interactivo.dto';
import { UpdateMapaInteractivoDto } from './dto/update-mapa-interactivo.dto';
import { getConnection } from 'src/config/dbconfig';

@Injectable()
export class MapaInteractivoService {
  async getInformation1(data: any) {

    const pool = await getConnection();
    try {
      const request = pool.request();

      const result = await request.execute('sp_getInformation1');
    } catch (error) {
      return "Error al obtener la información";
    }
  }



  async getInformation2(data: any) {

    const pool = await getConnection();
    try {
      const request = pool.request();

      const result = await request.execute('sp_getInformation1');
    } catch (error) {
      return "Error al obtener la información";
    }
  }


}
