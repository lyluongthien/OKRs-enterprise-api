import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class createTableRoles1593445333797 implements MigrationInterface {
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
      },
      {
        name: 'createAt',
        type: 'date',
      },
      {
        name: 'updateAt',
        type: 'date',
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(this.roleTable);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable(this.roleTable);
  }
}