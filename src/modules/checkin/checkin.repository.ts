import { Repository, EntityRepository } from 'typeorm';
import { HttpStatus, HttpException } from '@nestjs/common';

import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CreateCheckinDTO } from './checkin.dto';

@EntityRepository(CheckinEntity)
export class CheckinRepository extends Repository<CheckinEntity> {
  public async createCheckin(data: CreateCheckinDTO[]): Promise<any> {
    try {
      const dataModel = await this.create(data);
      // Save teamLeaderId
      dataModel.map((dataModel) => {
        dataModel.teamLeaderId = 1;
        return dataModel;
      });
      await this.save(dataModel);
      return dataModel;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
