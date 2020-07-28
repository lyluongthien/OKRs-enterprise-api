import { Test, TestingModule } from '@nestjs/testing';
import { UserStarService } from '../user-star.service';

describe('UserStarService', () => {
  let service: UserStarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStarService],
    }).compile();

    service = module.get<UserStarService>(UserStarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
