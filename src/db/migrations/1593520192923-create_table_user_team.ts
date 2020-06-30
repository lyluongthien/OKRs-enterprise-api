import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class createTableUserTeam1593520192923 implements MigrationInterface {
  private userTeamTable: Table = new Table({
    name: TableName.UserTeam,
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
    queryRunner.createTable(this.userTeamTable, true);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable(this.userTeamTable, true);
  }
}
