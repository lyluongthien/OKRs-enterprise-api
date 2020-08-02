import { EntityRepository, Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { TeamEntity } from '@app/db/entities/team.entity';
import { TeamDTO } from './team.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { HttpStatus, HttpException } from '@nestjs/common';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { ResponseModel } from '@app/constants/app.interface';

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {
  public async getTeams(options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('team')
        .select(['team.id', 'team.name', 'team.description', 'team.updatedAt'])
        .orderBy('team.updatedAt', 'DESC');
      return await paginate<TeamEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async searchTeam(text: string, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('team')
        .select(['team.id', 'team.name', 'team.description', 'team.updatedAt'])
        .where('team.name like :text', { text: '%' + text + '%' })
        .orderBy('team.updatedAt', 'DESC');
      return await paginate<TeamEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getListTeams(): Promise<TeamEntity[]> {
    try {
      return await this.createQueryBuilder('team')
        .select(['team.id', 'team.name'])
        .orderBy('team.updatedAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getDetailTeam(id: number): Promise<TeamEntity> {
    try {
      return await this.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async createTeam(data: TeamDTO): Promise<TeamEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateTeam(id: number, data: TeamDTO): Promise<TeamEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
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
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
