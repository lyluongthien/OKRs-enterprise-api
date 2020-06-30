import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class createTableUserStar1593520051461 implements MigrationInterface {
  private userStarTable: Table = new Table({
    name: TableName.UserStar,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(this.userStarTable, true);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(this.userStarTable, true);
  }
}
