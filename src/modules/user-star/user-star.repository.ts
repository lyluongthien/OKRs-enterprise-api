import { EntityRepository, Repository } from 'typeorm';
import { UserStarEntity } from '@app/db/entities/user-stars.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(UserStarEntity)
export class UserStarRepository extends Repository<UserStarEntity> {
  public async getAllUserStar(): Promise<UserStarEntity[]> {
    try {
      return await this
        .query(`SELECT "user"."fullName" AS "user_fullName", "user"."id" AS "user_id", SUM("user_stars"."star") AS "sum" 
              FROM "user_stars" "user_stars" LEFT JOIN "users" "user" ON "user"."id"="user_stars"."userId" 
              WHERE "cycleId" in (select "cycleId" from cycles c2) GROUP BY "user"."id", "user"."fullName"
              ORDER BY "sum" desc`);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getCurrentUserStar(id: number): Promise<UserStarEntity[]> {
    try {
      return await this
        .query(`SELECT "user"."fullName" AS "user_fullName", "user"."id" AS "user_id", SUM("user_stars"."star") AS "sum" 
              FROM "user_stars" "user_stars" LEFT JOIN "users" "user" ON "user"."id"="user_stars"."userId" 
              WHERE "cycleId" in (${id}) GROUP BY "user"."id", "user"."fullName"
              ORDER BY "sum" desc`);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
