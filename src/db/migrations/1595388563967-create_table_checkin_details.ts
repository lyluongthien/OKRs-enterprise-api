import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey } from '@app/constants/app.enums';
import { dropFksToTable } from '@app/libs/migrationSupport';

export class CreateTableCheckinDetails1595388563967 implements MigrationInterface {
  private checkinDetailTable: Table = new Table({
    name: TableName.CheckinDetail,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
      {
        name: 'targetValue',
        type: 'integer',
      },
      {
        name: 'valueObtained',
        type: 'integer',
      },
      {
        name: 'confidentLevel',
        type: 'integer',
      },
      {
        name: 'progress',
        type: 'varchar',
        length: '255',
      },
      {
        name: 'problems',
        type: 'varchar',
        length: '255',
      },
      {
        name: 'plans',
        type: 'varchar',
        length: '255',
      },
      {
        name: ForeignKey.CHECKIN_ID,
        type: 'integer',
      },
      {
        name: ForeignKey.KEY_RESULTS_ID,
        type: 'integer',
        isNullable: true,
      },
    ],
  });

  private pkCheckinId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.CHECKIN_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.Checkin,
    onDelete: 'SET NULL',
  });

  private pkKeyResultId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.KEY_RESULTS_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.KeyResult,
    onDelete: 'SET NULL',
  });

  private tableForeignKey: TableForeignKey[] = [this.pkCheckinId, this.pkKeyResultId];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.checkinDetailTable);

    await queryRunner.createForeignKeys(TableName.CheckinDetail, this.tableForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.CheckinDetail, [ForeignKey.CHECKIN_ID, ForeignKey.KEY_RESULTS_ID]);

    await queryRunner.dropTable(this.checkinDetailTable);
  }
}
