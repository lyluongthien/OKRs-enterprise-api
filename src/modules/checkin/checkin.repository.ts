import { Repository, EntityRepository, EntityManager } from 'typeorm';
import { HttpStatus, HttpException } from '@nestjs/common';

import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CreateCheckinDTO } from './checkin.dto';
import { CheckinDetailEntity } from '@app/db/entities/checkin-detail.entity';
import { CheckinStatus, CheckinType } from '@app/constants/app.enums';

@EntityRepository(CheckinEntity)
export class CheckinRepository extends Repository<CheckinEntity> {
  /**
   * @param data
   * @param manager
   * @description: Create and update checkin. If id null => create new checkin else => Update
   */
  public async createUpdateCheckin(data: CreateCheckinDTO, manager: EntityManager): Promise<any> {
    try {
      const teamLeaderId = 1;
      data.checkin.teamLeaderId = teamLeaderId;
      const checkinModel = await manager.getRepository(CheckinEntity).save(data.checkin);

      data.checkinDetails.map((data) => {
        data.checkinId = checkinModel.id;
        return data;
      });

      const checkinDetailModel = await manager.getRepository(CheckinDetailEntity).save(data.checkinDetails);
      return {
        checkin: checkinModel,
        checkin_details: checkinDetailModel,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getCheckinById(id: number): Promise<CheckinEntity> {
    try {
      const queryBuilder = this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.confidentLevel',
          'checkin.checkinAt',
          'checkin.nextCheckinDate',
          'checkin.status',
          'objective.id',
          'objective.title',
          'checkinDetails.id',
          'checkinDetails.valueObtained',
          'checkinDetails.confidentLevel',
          'checkinDetails.progress',
          'checkinDetails.problems',
          'checkinDetails.plans',
          'keyresult.id',
          'keyresult.content',
          'keyresult.targetValue',
          'keyresult.valueObtained',
        ])
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('checkin.checkinDetails', 'checkinDetails')
        .leftJoin('checkinDetails.keyResult', 'keyresult')
        .where('checkin.id= :id', { id })
        .getOne();

      return await queryBuilder;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getCheckinByObjectiveId(id: number): Promise<CheckinEntity[]> {
    try {
      const checkins = this.find({ where: { objectiveId: id } });

      return checkins;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public getDoneCheckinById(id: number, type: number): Promise<CheckinEntity[]> {
    try {
      const condition =
        type == CheckinType.MEMBER ? 'user.id = :id AND checkin.teamLeaderId IS NULL' : 'checkin.teamLeaderId = :id';
      return this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.confidentLevel',
          'checkin.checkinAt',
          'checkin.nextCheckinDate',
          'checkin.status',
          'objective.id',
          'objective.title',
          'user.id',
          'user.fullName',
        ])
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('objective.user', 'user')
        .leftJoin('checkin.checkinDetails', 'checkinDetails')
        .where(condition, { id })
        .andWhere('checkin.status = :status', { status: CheckinStatus.DONE })
        .getMany();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}