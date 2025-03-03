import { Test, TestingModule } from '@nestjs/testing';
import { DostawcyService } from './dostawcy.service';

describe('DostawcyService', () => {
  let service: DostawcyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DostawcyService],
    }).compile();

    service = module.get<DostawcyService>(DostawcyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
