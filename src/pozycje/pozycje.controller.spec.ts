import { Test, TestingModule } from '@nestjs/testing';
import { PozycjeController } from './pozycje.controller';

describe('PozycjeController', () => {
  let controller: PozycjeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PozycjeController],
    }).compile();

    controller = module.get<PozycjeController>(PozycjeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
