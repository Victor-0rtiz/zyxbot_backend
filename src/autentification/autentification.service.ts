import { Injectable } from '@nestjs/common';
import { CreateAutentificationDto } from './dto/create-autentification.dto';
import { UpdateAutentificationDto } from './dto/update-autentification.dto';

@Injectable()
export class AutentificationService {
  create(createAutentificationDto: CreateAutentificationDto) {
    return 'This action adds a new autentification';
  }

}
