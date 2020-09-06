import { Test } from '@nestjs/testing';
import { ObjectiveService } from '../objective.service';
import { Connection } from 'typeorm';
import { AppModule } from '@app/app.module';

describe('Objective Service', () => {
  let objectiveService: ObjectiveService;
  let connection: Connection;
  const mockConnection = () => ({
    transaction: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: Connection,
          useFactory: mockConnection,
        },
      ],
    }).compile();

    objectiveService = await module.get<ObjectiveService>(ObjectiveService);
    connection = await module.get<Connection>(Connection);
  });

  describe('manage OKRs', () => {
    it('test create OKRs', async () => {
      const someMockedUsers: any = {};
      someMockedUsers.objective = {
        title: 'TestOKRs222',
        parentObjectiveId: 20,
        cycleId: 3,
        isRootObjective: false,
      };
      someMockedUsers.keyResult = [
        { startValue: 0, targetValue: 100, content: 'KR1', linkPlans: '', linkResults: '', measureUnitId: 1 },
      ];
      const res = await objectiveService.createAndUpdateOKRs(someMockedUsers, connection.manager);
      expect(res).toBeDefined();
      expect(res.statusCode).toEqual(200);
    });
  });
});
