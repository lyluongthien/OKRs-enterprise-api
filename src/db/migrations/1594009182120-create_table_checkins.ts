import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey } from '@app/constants/app.enums';
import { dropFksToTable } from '@app/libs/migrationSupport';

export class createTableCheckins1594009182120 implements MigrationInterface {
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
        isNullable: false,
      },
      {
        name: 'confidentLevel',
        type: 'integer',
        isNullable: false,
      },
      {
        name: 'content',
        type: 'varchar',
      },
      {
        name: 'checkinAt',
        type: 'date',
      },
      {
        name: 'nextCheckinDate',
        type: 'date',
      },
      {
        name: 'status',
        type: 'bool',
      },
      {
        name: 'teamLeaderId',
        type: 'integer',
      },
      {
        name: 'templateCheckinId',
        type: 'integer',
      },
      {
        name: ForeignKey.KEY_RESULTS_ID,
        type: 'integer',
      },
      {
        name: 'createdAt',
        type: 'timestamp',
        default: 'now()',
      },
      {
        name: 'updatedAt',
        type: 'timestamp',
        default: 'now()',
      },
    ],
  });

  private tableForeignKey = [
    new TableForeignKey({
      columnNames: [ForeignKey.KEY_RESULTS_ID],
      referencedColumnNames: ['id'],
      referencedTableName: TableName.KeyResult,
      onDelete: 'CASCADE',
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.checkinTable);

    await queryRunner.createForeignKeys(TableName.Checkin, this.tableForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.Checkin, [ForeignKey.KEY_RESULTS_ID]);

    await queryRunner.dropTable(this.checkinTable);
  }
}
