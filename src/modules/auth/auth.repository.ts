import { Repository, EntityRepository } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { InviteTokenEntity } from '@app/db/entities/invite-token.entity';
import { InviteTokenDTO } from './auth.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';

@EntityRepository(InviteTokenEntity)
export class TokenRepository extends Repository<InviteTokenEntity> {
  public async createToken(token: string): Promise<InviteTokenEntity> {
    try {
      const tokenEntity = this.create({ token });
      await this.save(tokenEntity);

      return tokenEntity;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getToken(token?: string): Promise<InviteTokenEntity> {
    try {
      if (token) {
        return await this.findOne({ where: { token } });
      }
      return await this.findOne();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateToken(id: number, data: InviteTokenDTO): Promise<void> {
    try {
      await this.update({ id }, data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
