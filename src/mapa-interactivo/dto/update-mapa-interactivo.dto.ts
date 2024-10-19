import { PartialType } from '@nestjs/mapped-types';
import { CreateMapaInteractivoDto } from './create-mapa-interactivo.dto';

export class UpdateMapaInteractivoDto extends PartialType(CreateMapaInteractivoDto) {}
