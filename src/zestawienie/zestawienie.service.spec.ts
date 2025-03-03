import { Test, TestingModule } from '@nestjs/testing';
import { ZestawienieService } from './zestawienie.service';

describe('ZestawienieService', () => {
  let service: ZestawienieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZestawienieService],
    }).compile();

    service = module.get<ZestawienieService>(ZestawienieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
