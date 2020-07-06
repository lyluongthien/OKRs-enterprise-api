import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey } from '@app/constants/app.enums';
import { dropFksToTable } from '@app/libs/migrationSupport';

export class createTableUserTeams1594008723246 implements MigrationInterface {
  private userTeamTable: Table = new Table({
    name: TableName.UserTeam,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
      {
        name: 'isLeader',
        type: 'bool',
      },
      {
        name: ForeignKey.USER_ID,
        type: 'integer',
      },
      {
        name: ForeignKey.TEAM_ID,
        type: 'integer',
      },
    ],
  });

  private tableForeignKey = [
    new TableForeignKey({
      columnNames: [ForeignKey.USER_ID],
      referencedColumnNames: ['id'],
      referencedTableName: TableName.User,
      onDelete: 'CASCADE',
    }),
    new TableForeignKey({
      columnNames: [ForeignKey.TEAM_ID],
      referencedColumnNames: ['id'],
      referencedTableName: TableName.Teams,
      onDelete: 'CASCADE',
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.userTeamTable, true);

    await queryRunner.createForeignKeys(TableName.UserTeam, this.tableForeignKey);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.User, [ForeignKey.USER_ID, ForeignKey.TEAM_ID]);

    await queryRunner.dropTable(TableName.UserTeam, true);
  }
}
