import { Test, TestingModule } from '@nestjs/testing';
import { CycleService } from '../cycle.service';

describe('CycleService', () => {
  let service: CycleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CycleService],
    }).compile();

    service = module.get<CycleService>(CycleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
