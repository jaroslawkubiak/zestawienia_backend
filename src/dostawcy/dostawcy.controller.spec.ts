import { Test, TestingModule } from '@nestjs/testing';
import { DostawcyController } from './dostawcy.controller';

describe('DostawcyController', () => {
  let controller: DostawcyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DostawcyController],
    }).compile();

    controller = module.get<DostawcyController>(DostawcyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
