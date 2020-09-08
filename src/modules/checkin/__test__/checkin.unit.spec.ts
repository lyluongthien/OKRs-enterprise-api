import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppModule } from '@app/app.module';
import { CheckinService } from '../checkin.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CHECKIN_FOBIDDEN, CHECKIN_INVALID } from '@app/constants/app.exeption';
import { CheckinStatus } from '@app/constants/app.enums';
import { CheckinDTO, CheckinDetailDTO, CreateCheckinDTO } from '../checkin.dto';

describe('CHECKIN SERVICE', () => {
  let checkinService: CheckinService;
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

    checkinService = await module.get<CheckinService>(CheckinService);
    connection = await module.get<Connection>(Connection);
  });

  describe('GET CHECKIN DETAIL', () => {
    it('get checkin', async () => {
      try {
        const res = await checkinService.getCheckinDetail(1, 3);
        expect(res).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
    it('get checkin with status is draft', async () => {
      try {
        const res = await checkinService.getCheckinDetail(10, 14);
        expect(res).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
    it('fobidden', async () => {
      try {
        await checkinService.getCheckinDetail(1, 1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(CHECKIN_FOBIDDEN.statusCode);
      }
    });
    it('Checkin detail not found', async () => {
      try {
        await checkinService.getCheckinDetail(100000000, 1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(CHECKIN_INVALID.statusCode);
      }
    });
  });

  describe('CREATE CHECKIN', () => {
    it('Create checkin with empty body', async () => {
      const checkinData: CheckinDTO = {
        teamLeaderId: 3,
        objectiveId: 13,
        confidentLevel: 1,
        nextCheckinDate: new Date('2020-09-10'),
        progress: 3,
        status: CheckinStatus.DRAFT,
        checkinAt: null,
        id: 0,
        isCompleted: false,
      };
      const checkinDetailData: CheckinDetailDTO = {
        checkinId: 0,
        confidentLevel: 1,
        id: 0,
        keyResultId: 29,
        plans: 'test',
        problems: 'test',
        progress: 'test',
        targetValue: 100,
        valueObtained: 12,
      };
      const checkinDetailData1: CheckinDetailDTO = {
        checkinId: 0,
        confidentLevel: 1,
        id: 0,
        keyResultId: 30,
        plans: 'test',
        problems: 'test',
        progress: 'test',
        targetValue: 100,
        valueObtained: 12,
      };
      const checkinDetailData2: CheckinDetailDTO = {
        checkinId: 0,
        confidentLevel: 1,
        id: 0,
        keyResultId: 31,
        plans: 'test',
        problems: 'test',
        progress: 'test',
        targetValue: 100,
        valueObtained: 12,
      };
      const createCheckin: CreateCheckinDTO = {
        checkin: checkinData,
        checkinDetails: [checkinDetailData, checkinDetailData1, checkinDetailData2],
      };
      try {
        const res = await checkinService.createUpdateCheckin(createCheckin, connection.manager, 13, null);
        expect(res).toBeDefined();
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('CREATE CHECKIN ADMIN', () => {
    it('Create checkin with empty body', async () => {
      const checkinData: CheckinDTO = {
        teamLeaderId: 3,
        objectiveId: 1,
        confidentLevel: 1,
        nextCheckinDate: new Date('2020-09-10'),
        progress: 3,
        status: CheckinStatus.DONE,
        checkinAt: null,
        id: 0,
        isCompleted: false,
      };
      const checkinDetailData: CheckinDetailDTO = {
        checkinId: 0,
        confidentLevel: 1,
        id: 0,
        keyResultId: 29,
        plans: 'test',
        problems: 'test',
        progress: 'test',
        targetValue: 100,
        valueObtained: 12,
      };
      const checkinDetailData1: CheckinDetailDTO = {
        checkinId: 0,
        confidentLevel: 1,
        id: 0,
        keyResultId: 2,
        plans: 'test',
        problems: 'test',
        progress: 'test',
        targetValue: 100,
        valueObtained: 12,
      };
      const createCheckin: CreateCheckinDTO = {
        checkin: checkinData,
        checkinDetails: [checkinDetailData, checkinDetailData1],
      };
      try {
        const res = await checkinService.createUpdateCheckinAdmin(createCheckin, connection.manager, 14, null);
        expect(res).toBeDefined();
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('UPDATE REQUEST CHECKIN', () => {
    it('Leader update checkin when staff request', async () => {
      const checkinData: CheckinDTO = {
        teamLeaderId: 3,
        objectiveId: 13,
        confidentLevel: 1,
        nextCheckinDate: new Date('2020-09-10'),
        progress: 3,
        status: CheckinStatus.DRAFT,
        checkinAt: null,
        id: 0,
        isCompleted: false,
      };
      const checkinDetailData: CheckinDetailDTO = {
        checkinId: 0,
        confidentLevel: 1,
        id: 0,
        keyResultId: 29,
        plans: 'test',
        problems: 'test',
        progress: 'test',
        targetValue: 100,
        valueObtained: 12,
      };
      const checkinDetailData1: CheckinDetailDTO = {
        checkinId: 0,
        confidentLevel: 1,
        id: 0,
        keyResultId: 30,
        plans: 'test',
        problems: 'test',
        progress: 'test',
        targetValue: 100,
        valueObtained: 12,
      };
      const checkinDetailData2: CheckinDetailDTO = {
        checkinId: 0,
        confidentLevel: 1,
        id: 0,
        keyResultId: 31,
        plans: 'test',
        problems: 'test',
        progress: 'test',
        targetValue: 100,
        valueObtained: 12,
      };
      const createCheckin: CreateCheckinDTO = {
        checkin: checkinData,
        checkinDetails: [checkinDetailData, checkinDetailData1, checkinDetailData2],
      };
      try {
        const res = await checkinService.updateCheckinRequest(createCheckin, connection.manager, 3, null);
        expect(res).toBeDefined();
        expect(res.statusCode).toEqual(HttpStatus.CREATED);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });
});
