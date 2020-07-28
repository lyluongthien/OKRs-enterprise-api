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
        name: 'inferiorId',
        type: 'integer',
        isNullable: false,
      },
      {
        name: 'superiorId',
        type: 'integer',
        isNullable: false,
      },
      {
        name: 'content',
        type: 'varchar',
        isNullable: false,
        length: '255',
      },
      {
        name: ForeignKey.EVALUATION_CRITERIA_ID,
        type: 'integer',
      },
      {
        name: ForeignKey.OBJECTIVE_ID,
        type: 'integer',
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

  private pkInferiorId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.INFERIOR_ID],
    referencedColumnNames: ['id'],
    referencedTableName: TableName.User,
    onDelete: 'SET NULL',
  });

  private pkSuperiorId: TableForeignKey = new TableForeignKey({
    columnNames: [ForeignKey.SUPERIOR_ID],
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
    this.pkInferiorId,
    this.pkSuperiorId,
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
