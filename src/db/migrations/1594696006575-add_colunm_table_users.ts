import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class AddColunmTableUsers1594696006575 implements MigrationInterface {
  private resetPasswordTokenCol: TableColumn = new TableColumn({
    name: 'resetPasswordToken',
    type: 'varchar',
    length: '255',
    isNullable: true,
    isUnique: true,
  });
  private resetPasswordTokenExpireCol: TableColumn = new TableColumn({
    name: 'resetPasswordTokenExpire',
    type: 'timestamptz',
    isNullable: true,
  });

  private tableColums: TableColumn[] = [this.resetPasswordTokenCol, this.resetPasswordTokenExpireCol];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(TableName.User, this.tableColums);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(TableName.User, this.tableColums);
  }
}
