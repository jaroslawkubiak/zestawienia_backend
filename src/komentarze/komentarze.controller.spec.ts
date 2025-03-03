import { Test, TestingModule } from '@nestjs/testing';
import { KomentarzeController } from './komentarze.controller';

describe('KomentarzeController', () => {
  let controller: KomentarzeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KomentarzeController],
    }).compile();

    controller = module.get<KomentarzeController>(KomentarzeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
