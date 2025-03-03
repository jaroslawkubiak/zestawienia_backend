import { Test, TestingModule } from '@nestjs/testing';
import { KlienciService } from './klienci.service';

describe('KlienciService', () => {
  let service: KlienciService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KlienciService],
    }).compile();

    service = module.get<KlienciService>(KlienciService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
