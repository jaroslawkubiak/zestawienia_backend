import { Test, TestingModule } from '@nestjs/testing';
import { ProduktyController } from './produkty.controller';

describe('ProduktyController', () => {
  let controller: ProduktyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProduktyController],
    }).compile();

    controller = module.get<ProduktyController>(ProduktyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
