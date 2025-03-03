import { Test, TestingModule } from '@nestjs/testing';
import { KomentarzeService } from './komentarze.service';

describe('KomentarzeService', () => {
  let service: KomentarzeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KomentarzeService],
    }).compile();

    service = module.get<KomentarzeService>(KomentarzeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
