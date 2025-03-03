import { Test, TestingModule } from '@nestjs/testing';
import { PraceDoWykonaniaService } from './prace_do_wykonania.service';

describe('PraceDoWykonaniaService', () => {
  let service: PraceDoWykonaniaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PraceDoWykonaniaService],
    }).compile();

    service = module.get<PraceDoWykonaniaService>(PraceDoWykonaniaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
