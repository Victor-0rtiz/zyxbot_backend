import { PartialType } from '@nestjs/mapped-types';
import { CreateAutentificationDto } from './create-autentification.dto';

export class UpdateAutentificationDto extends PartialType(CreateAutentificationDto) {}
