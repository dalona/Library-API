//Las pruebas unitarias se enfocan en probar unidades individuales de código (como servicios, controladores, etc.) de forma aislada.


//Importamos las herramientas necesarias de NestJS y Jest.

import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';


//Definimos un bloque de pruebas para AppService.
describe('AppService', ()=>{
    let service: AppService;
//Configuramos el módulo de pruebas antes de cada prueba, instanciando AppService.
    beforeEach(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService]
        }).compile();

        service = module.get<AppService>(AppService);
    })

    //Definimos casos de prueba individuales.
    it('debería estar definido', () => {
        expect(service).toBeDefined();
      });
    
      it('getHello debería retornar "Hello World!"', () => {
        expect(service.getHello()).toBe('Hello World!');
      });
        })
