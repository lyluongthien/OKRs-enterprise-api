import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class users1592904360524 implements MigrationInterface {
  private userTable: Table = new Table({
    name: TableName.User,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'email',
        type: 'varchar',
        length: '255',
        isUnique: true,
        isNullable: false,
      },
      // {
      //   name: 'created_at',
      //   type: 'timestamptz',
      //   isNullable: false,
      //   default: 'now()',
      // },
      // {
      //   name: 'updated_at',
      //   type: 'timestamptz',
      //   isNullable: false,
      //   default: 'now()',
      // },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.userTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.userTable);
  }
}
