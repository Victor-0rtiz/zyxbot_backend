import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AutentificationService } from './autentification.service';
import { CreateAutentificationDto } from './dto/create-autentification.dto';
import { UpdateAutentificationDto } from './dto/update-autentification.dto';
import { Response } from 'express';
import Json_webtoken from 'src/utils/jwt/jwt';

@Controller('autentification')
export class AutentificationController {
  constructor(private readonly autentificationService: AutentificationService) {}

  @Post()
  create(@Body() body: any, @Res() res: Response) {
 
    try {
     const token =  Json_webtoken.sign({ user: body.user, email: body.email });

     res.status(200).json({ token });
     return
    } catch (error) {
      res.status(404).json("Error al crear el token");
     return
    }
  }

 

  
}
