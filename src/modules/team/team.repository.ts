import { EntityRepository, Repository, ObjectLiteral } from 'typeorm';
import { Pagination, paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamDTO } from './team.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { HttpStatus, HttpException } from '@nestjs/common';
import { ResponseModel } from '@app/constants/app.interface';

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {
  public async getTeams(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('team');
      return await paginate<TeamEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getDetailTeam(id: number): Promise<TeamEntity> {
    try {
      return await this.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async createTeam(data: TeamDTO): Promise<any> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateTeam(id: number, data: TeamDTO): Promise<TeamEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async deteleTeam(id: number): Promise<ResponseModel> {
    try {
      const rowEffected: number = (await this.delete({ id })).affected;
      if (rowEffected == 1)
        return {
          statusCode: HttpStatus.OK,
          message: CommonMessage.SUCCESS,
          data: { is_deleted: true },
        };

      return { statusCode: HttpStatus.OK, message: CommonMessage.DELETE_FAIL, data: { is_deleted: false } };
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
