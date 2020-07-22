import { Repository, EntityRepository, EntityManager } from 'typeorm';
import { HttpStatus, HttpException } from '@nestjs/common';

import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CreateCheckinDTO } from './checkin.dto';
import { CheckinDetailEntity } from '@app/db/entities/checkin-detail.entity';

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
}
