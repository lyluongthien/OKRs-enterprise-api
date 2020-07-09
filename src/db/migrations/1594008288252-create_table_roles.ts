import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class CreateTableRoles1594008288252 implements MigrationInterface {
  private roleTable: Table = new Table({
    name: TableName.Role,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
      {
        name: 'name',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
        length: '50',
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

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.roleTable, true);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.roleTable, true);
  }
}
