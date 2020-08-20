import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { UserStarEntity } from '@app/db/entities/user-stars.entity';
import { HttpException } from '@nestjs/common';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { UserStarDTO } from './user-star.dto';

@EntityRepository(UserStarEntity)
export class UserStarRepository extends Repository<UserStarEntity> {
  public async getAllUserStar(): Promise<UserStarEntity[]> {
    try {
      return await this.query(`SELECT "user"."fullName" AS "user_fullName", "user"."avatarURL", 
      "user"."gravatarURL", "user"."id" AS "user_id", 
      SUM("user_stars"."star") AS "sum" 
      FROM "user_stars" "user_stars" LEFT JOIN "users" "user" ON "user"."id"="user_stars"."userId" 
      WHERE "cycleId" in (select "cycleId" from cycles c2) GROUP BY "user"."id", "user"."fullName"
      ORDER BY "sum" desc`);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCycleUserStar(id: number): Promise<UserStarEntity[]> {
    try {
      return await this.query(`SELECT "user"."fullName" AS "user_fullName","user"."avatarURL", 
      "user"."gravatarURL", "user"."id" AS "user_id", 
              SUM("user_stars"."star") AS "sum" 
              FROM "user_stars" "user_stars" LEFT JOIN "users" "user" ON "user"."id"="user_stars"."userId" 
              WHERE "cycleId" in (${id}) GROUP BY "user"."id", "user"."fullName"
              ORDER BY "sum" desc limit 10`);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async createUserStar(data: UserStarDTO, manager: EntityManager): Promise<void> {
    try {
      await manager.getRepository(UserStarEntity).save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
