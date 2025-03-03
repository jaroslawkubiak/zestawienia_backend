import { Test, TestingModule } from '@nestjs/testing';
import { ZestawienieController } from './zestawienie.controller';

describe('ZestawienieController', () => {
  let controller: ZestawienieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZestawienieController],
    }).compile();

    controller = module.get<ZestawienieController>(ZestawienieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
