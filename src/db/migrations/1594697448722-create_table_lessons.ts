import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class CreateTableLessons1594697448722 implements MigrationInterface {
  private lesssonsTable: Table = new Table({
    name: TableName.Lesson,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
      {
        name: 'title',
        type: 'varchar',
        isNullable: false,
        length: '255',
      },
      {
        name: 'content',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'thumbnail',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'abstract',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'index',
        type: 'integer',
        isNullable: false,
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
      {
        name: 'slug',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.lesssonsTable, true);
    await queryRunner.createIndex(
      TableName.Lesson,
      new TableIndex({
        name: 'IDX_SLUG',
        columnNames: ['slug'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(TableName.Lesson, 'IDX_SLUG');
    await queryRunner.dropTable(this.lesssonsTable, true);
  }
}
