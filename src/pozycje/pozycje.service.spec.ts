import { Test, TestingModule } from '@nestjs/testing';
import { PozycjeService } from './pozycje.service';

describe('PozycjeService', () => {
  let service: PozycjeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PozycjeService],
    }).compile();

    service = module.get<PozycjeService>(PozycjeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
