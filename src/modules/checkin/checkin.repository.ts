import { Repository, EntityRepository, EntityManager } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CreateCheckinDTO } from './checkin.dto';
import { CheckinDetailEntity } from '@app/db/entities/checkin-detail.entity';
import { CheckinStatus, CheckinType } from '@app/constants/app.enums';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';

@EntityRepository(CheckinEntity)
export class CheckinRepository extends Repository<CheckinEntity> {
  /**
   * @param data
   * @param manager
   * @description: Create and update checkin. If id null => create new checkin else => Update
   */
  public async createUpdateCheckin(data: CreateCheckinDTO, manager: EntityManager, teamLeadId: number): Promise<any> {
    try {
      data.checkin.teamLeaderId = teamLeadId;
      const checkinModel = await manager.getRepository(CheckinEntity).save(data.checkin);
      const keyResultValue = [];
      data.checkinDetails.map((data) => {
        keyResultValue.push({ id: data.keyResultId, valueObtained: data.valueObtained });
        data.checkinId = checkinModel.id;
        return data;
      });
      const checkinDetailModel = await manager.getRepository(CheckinDetailEntity).save(data.checkinDetails);
      await manager.getRepository(KeyResultEntity).save(keyResultValue);
      return {
        checkin: checkinModel,
        checkin_details: checkinDetailModel,
      };
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCheckinByObjectiveId(id: number): Promise<CheckinEntity[]> {
    try {
      const checkins = this.find({ where: { objectiveId: id } });

      return checkins;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public getDoneCheckinById(id: number, type: number): Promise<CheckinEntity[]> {
    try {
      let condition = null;
      if (type == CheckinType.MEMBER) {
        condition = 'user.id = :id AND checkin.teamLeaderId IS NULL';
      } else {
        condition = 'checkin.teamLeaderId = :id';
      }
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCheckinRequest(teamId: number, cycleId: number): Promise<CheckinEntity[]> {
    try {
      return await this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.checkinAt',
          'objective.id',
          'objective.title',
          'user.id',
          'user.fullName',
          'team.name',
        ])
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('objective.user', 'user')
        .leftJoin('objective.cycle', 'cycle')
        .leftJoin('user.team', 'team')
        .where('team.id= :team', { team: teamId })
        .andWhere('cycle.id = :cycle', { cycle: cycleId })
        .getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
