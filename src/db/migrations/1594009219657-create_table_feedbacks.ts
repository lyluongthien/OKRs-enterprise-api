import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey } from '@app/constants/app.enums';
import { dropFksToTable } from '@app/libs/migrationSupport';

export class CreateTableFeedbacks1594009219657 implements MigrationInterface {
  private feedbackTable: Table = new Table({
    name: TableName.Feeback,
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
        isNullable: false,
      },
      {
        name: ForeignKey.RECEIVER_ID,
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
        name: 'isLeaderFeedBack',
        type: 'bool',
        default: false,
      },
      {
        name: 'isStaffFeedBack',
        type: 'bool',
        default: false,
      },
      {
        name: ForeignKey.EVALUATION_CRITERIA_ID,
        type: 'integer',
      },
      {
        name: ForeignKey.CHECKIN_ID,
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

  private tableForeignKey: TableForeignKey[] = [
    this.pkEvalCriteriaId,
    this.pkCheckinId,
    this.pkSenderId,
    this.pkReceiverId,
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.feedbackTable);

    await queryRunner.createForeignKeys(TableName.Feeback, this.tableForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.Feeback, [ForeignKey.EVALUATION_CRITERIA_ID, ForeignKey.CHECKIN_ID]);

    await queryRunner.dropTable(this.feedbackTable);
  }
}
