import { Test, TestingModule } from '@nestjs/testing';
import { PraceDoWykonaniaController } from './prace_do_wykonania.controller';

describe('PraceDoWykonaniaController', () => {
  let controller: PraceDoWykonaniaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PraceDoWykonaniaController],
    }).compile();

    controller = module.get<PraceDoWykonaniaController>(PraceDoWykonaniaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
