import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey, CheckinStatus, ConfidentLevel } from '@app/constants/app.enums';
import { dropFksToTable } from '@app/libs/migrationSupport';

export class CreateTableCheckins1594009182120 implements MigrationInterface {
  private checkinTable: Table = new Table({
    name: TableName.Checkin,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
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
        name: 'checkinAt',
        type: 'date',
        default: 'now()',
      },
      {
        name: 'nextCheckinDate',
        type: 'date',
        isNullable: true,
      },
      {
        name: 'status', // Save status of Checkin: Draf, Pedding, Done
        type: 'enum',
        enum: [CheckinStatus.DRAFT, CheckinStatus.PEDDING, CheckinStatus.DONE],
        isNullable: false,
      },
      {
        name: 'teamLeaderId',
        type: 'integer',
      },
      {
        name: ForeignKey.KEY_RESULTS_ID,
        type: 'integer',
      },
      {
        name: 'updatedAt',
        type: 'timestamptz',
        default: 'now()',
      },
    ],
  });

  private tableForeignKey: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.KEY_RESULTS_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.KeyResult,
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.checkinTable);

    await queryRunner.createForeignKey(TableName.Checkin, this.tableForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.Checkin, [ForeignKey.KEY_RESULTS_ID]);

    await queryRunner.dropTable(this.checkinTable);
  }
}
