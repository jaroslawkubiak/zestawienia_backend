import { Test, TestingModule } from '@nestjs/testing';
import { KlienciController } from './klienci.controller';

describe('KlienciController', () => {
  let controller: KlienciController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KlienciController],
    }).compile();

    controller = module.get<KlienciController>(KlienciController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
