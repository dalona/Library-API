import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest'; //supertest: Permite realizar solicitudes HTTP a la aplicación NestJS en pruebas.
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
//beforeAll: Inicializa la aplicación antes de las pruebas.
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
//it: Realiza una solicitud GET al endpoint / y verifica la respuesta.
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

//afterAll: Cierra la aplicación después de las pruebas.
  afterAll(async () => {
    await app.close();
  });
});
