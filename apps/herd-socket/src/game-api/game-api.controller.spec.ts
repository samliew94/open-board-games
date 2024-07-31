import { Test, TestingModule } from '@nestjs/testing';
import { GameApiController } from './game-api.controller';

describe('GameApiController', () => {
  let controller: GameApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameApiController],
    }).compile();

    controller = module.get<GameApiController>(GameApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
