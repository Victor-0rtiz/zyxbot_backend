import { Test, TestingModule } from '@nestjs/testing';
import { ChatwsGateway } from './chatws.gateway';

describe('ChatwsGateway', () => {
  let gateway: ChatwsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatwsGateway],
    }).compile();

    gateway = module.get<ChatwsGateway>(ChatwsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
