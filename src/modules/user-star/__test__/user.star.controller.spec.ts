import { Test, TestingModule } from '@nestjs/testing';
import { UserStarController } from '../user-star.controller';

describe('UserStar Controller', () => {
  let controller: UserStarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStarController],
    }).compile();

    controller = module.get<UserStarController>(UserStarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
