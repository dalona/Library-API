/*Las pruebas de integración verifican cómo interactúan diferentes partes del sistema entre sí.
 En NestJS, esto a menudo implica iniciar una instancia real de la aplicación y probar rutas, 
 servicios y controladores juntos.*/


import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
