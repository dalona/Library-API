// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController (integración)', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('debería retornar "Hello World!"', () => {
      jest.spyOn(appService, 'getHello').mockImplementation(() => 'Hello World!');
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
