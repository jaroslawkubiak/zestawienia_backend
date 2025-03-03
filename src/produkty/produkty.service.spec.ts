import { Test, TestingModule } from '@nestjs/testing';
import { ProduktyService } from './produkty.service';

describe('ProduktyService', () => {
  let service: ProduktyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProduktyService],
    }).compile();

    service = module.get<ProduktyService>(ProduktyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
