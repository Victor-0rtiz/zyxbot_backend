import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Json_webtoken from 'src/utils/jwt/jwt';


export function AutorizationMiddleware(req, res: Response, next: NextFunction) { 
  
  const tokenauth = req.headers.authorization

  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // console.log('Client IP:', ip);
  if (!tokenauth) {
    return res.status(401).json({ message: 'Token Invalido' });
  }
  const deco = Json_webtoken.verify(tokenauth);






  next();
}
