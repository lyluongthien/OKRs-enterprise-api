import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class CreateTableTeams1594008652307 implements MigrationInterface {
  private teamsTable: Table = new Table({
    name: TableName.Team,
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
        length: '255',
      },
      {
        name: 'description',
        type: 'varchar',
        isNullable: false,
        length: '255',
      },
      {
        name: 'createdAt',
        type: 'timestamptz',
        default: 'now()',
      },
      {
        name: 'updatedAt',
        type: 'timestamptz',
        default: 'now()',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.teamsTable, true);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.teamsTable, true);
  }
}
