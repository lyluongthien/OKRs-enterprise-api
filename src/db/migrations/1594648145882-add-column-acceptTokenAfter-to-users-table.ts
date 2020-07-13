import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey } from '@app/constants/app.enums';
import { createTableForeignKey } from '@app/libs/migrationSupport';

export class AddColumnAcceptTokenAfterToUsersTable1594648145882 implements MigrationInterface {
  private acceptTokenAfterColumn: TableColumn = new TableColumn({
    name: 'aceptTokenAfter',
    type: 'timestamptz',
    isNullable: true,
  });

  private isLeaderColumn: TableColumn = new TableColumn({
    name: 'isLeader',
    type: 'boolean',
    isNullable: true,
  });

  private teamIdColumn: TableColumn = new TableColumn({
    name: ForeignKey.TEAM_ID,
    type: 'integer',
    isNullable: true,
  });

  private fkTeamID: TableForeignKey = createTableForeignKey(
    [ForeignKey.TEAM_ID],
    TableName.Team,
    'CASCADE',
  ) as TableForeignKey;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(TableName.User, this.acceptTokenAfterColumn);
    await queryRunner.addColumn(TableName.User, this.isLeaderColumn);
    await queryRunner.addColumn(TableName.User, this.teamIdColumn);
    await queryRunner.createForeignKey(TableName.User, this.fkTeamID);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(TableName.User, this.fkTeamID);
    await queryRunner.dropColumns(TableName.User, [
      this.acceptTokenAfterColumn,
      this.isLeaderColumn,
      this.teamIdColumn,
    ]);
  }
}
