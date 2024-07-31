import { Test, TestingModule } from '@nestjs/testing';
import { MyServerGateway } from './my-server.gateway';

describe('MyServerGateway', () => {
  let gateway: MyServerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyServerGateway],
    }).compile();

    gateway = module.get<MyServerGateway>(MyServerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
