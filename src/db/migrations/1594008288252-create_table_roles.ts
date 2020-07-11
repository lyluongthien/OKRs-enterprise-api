import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName, RoleEnum } from '@app/constants/app.enums';

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
        type: 'enum',
        isNullable: false,
        enum: [RoleEnum.ADMIN, RoleEnum.HR, RoleEnum.STAFF],
        enumName: 'roleName',
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
