import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey } from '@app/constants/app.enums';
import { dropFksToTable } from '@app/libs/migrationSupport';

export class CreateTableRecognitions1594009275111 implements MigrationInterface {
  private recognitionTable: Table = new Table({
    name: TableName.Recognition,
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

  private tableForeignKey: TableForeignKey[] = [
    this.pkObjectiveId,
    this.pkSenderId,
    this.pkReceiverId,
    this.pkCycleId,
    this.pkEvalCriteriaId,
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.recognitionTable);

    await queryRunner.createForeignKeys(TableName.Recognition, this.tableForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.Recognition, [ForeignKey.EVALUATION_CRITERIA_ID]);

    await queryRunner.dropTable(this.recognitionTable);
  }
}
