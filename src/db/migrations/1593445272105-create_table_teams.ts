import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class createTableTeams1593445272105 implements MigrationInterface {
  private teamsTable: Table = new Table({
    name: TableName.Teams,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
      {
        name: 'name',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'createdAt',
        type: 'date',
      },
      {
        name: 'updatedAt',
        type: 'date',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(this.teamsTable, true);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable(this.teamsTable, true);
  }
}
