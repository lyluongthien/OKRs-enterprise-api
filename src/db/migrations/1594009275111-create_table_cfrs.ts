import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey, TypeCFRsHistory } from '@app/constants/app.enums';
import { dropFksToTable } from '@app/libs/migrationSupport';

export class CreateTableCFRs1594009275111 implements MigrationInterface {
  private cfrsTable: Table = new Table({
    name: TableName.CFRs,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
      {
        name: ForeignKey.SENDER_ID,
        type: 'integer',
      },
      {
        name: ForeignKey.RECEIVER_ID,
        type: 'integer',
      },
      {
        name: 'content',
        type: 'varchar',
        isNullable: true,
        length: '255',
      },
      {
        name: ForeignKey.EVALUATION_CRITERIA_ID,
        type: 'integer',
      },
      {
        name: ForeignKey.OBJECTIVE_ID,
        type: 'integer',
        isNullable: true,
      },
      {
        name: ForeignKey.CYCLE_ID,
        type: 'integer',
        isNullable: true,
      },
      {
        name: ForeignKey.CHECKIN_ID,
        type: 'integer',
        isNullable: true,
      },
      {
        name: 'type',
        type: 'enum',
        enum: [TypeCFRsHistory.FEED_BACK, TypeCFRsHistory.RECOGNITION],
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

  private pkObjectiveId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.OBJECTIVE_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.Objective,
    onDelete: 'SET NULL',
  });

  private pkSenderId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.SENDER_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.User,
    onDelete: 'SET NULL',
  });

  private pkReceiverId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.RECEIVER_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.User,
    onDelete: 'SET NULL',
  });

  private pkCycleId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.CYCLE_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.Cycle,
    onDelete: 'SET NULL',
  });

  private pkEvalCriteriaId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.EVALUATION_CRITERIA_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.EvaluationCriteria,
    onDelete: 'SET NULL',
  });

  private pkCheckinId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.CHECKIN_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.Checkin,
    onDelete: 'SET NULL',
  });

  private tableForeignKey: TableForeignKey[] = [
    this.pkObjectiveId,
    this.pkSenderId,
    this.pkReceiverId,
    this.pkCycleId,
    this.pkEvalCriteriaId,
    this.pkCheckinId,
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.cfrsTable);

    await queryRunner.createForeignKeys(TableName.CFRs, this.tableForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.CFRs, [ForeignKey.EVALUATION_CRITERIA_ID]);

    await queryRunner.dropTable(this.cfrsTable);
  }
}
