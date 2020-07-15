import { Repository, EntityRepository } from 'typeorm';
import { HttpStatus, HttpException } from '@nestjs/common';

import { InviteTokenEntity } from '@app/db/entities/invite-token.entity';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(InviteTokenEntity)
export class TokenRepository extends Repository<InviteTokenEntity> {
  public async createToken(token: string): Promise<InviteTokenEntity> {
    try {
      const tokenEntity = this.create({ token });
      await this.save(tokenEntity);

      return tokenEntity;
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getToken(token: string): Promise<InviteTokenEntity> {
    try {
      return await this.findOne({ where: { token } });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
