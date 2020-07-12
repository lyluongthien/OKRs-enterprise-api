import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey } from '@app/constants/app.enums';
import { dropFksToTable } from '@app/libs/migrationSupport';

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
        name: ForeignKey.TEMPLATE_ID,
        type: 'integer',
        isNullable: true,
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

  private pkTemplateId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.TEMPLATE_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.TemplateCheckin,
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.teamsTable, true);

    await queryRunner.createForeignKey(TableName.Team, this.pkTemplateId);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.Team, [ForeignKey.TEMPLATE_ID]);

    await queryRunner.dropTable(this.teamsTable, true);
  }
}
