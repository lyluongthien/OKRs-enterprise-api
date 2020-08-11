import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey, CheckinStatus } from '@app/constants/app.enums';
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
        name: 'confidentLevel',
        type: 'integer',
      },
      {
        name: 'checkinAt',
        type: 'timestamptz',
        default: 'now()',
      },
      {
        name: 'nextCheckinDate',
        type: 'date',
        isNullable: true,
      },
      {
        name: 'status', // Save status of Checkin: Draf, Pending, Done
        type: 'enum',
        enum: [CheckinStatus.DRAFT, CheckinStatus.PENDING, CheckinStatus.DONE, CheckinStatus.CLOSED],
        isNullable: false,
      },
      {
        name: 'teamLeaderId',
        type: 'integer',
        isNullable: true,
      },
      {
        name: ForeignKey.OBJECTIVE_ID,
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
    columnNames: [ForeignKey.OBJECTIVE_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.Objective,
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
