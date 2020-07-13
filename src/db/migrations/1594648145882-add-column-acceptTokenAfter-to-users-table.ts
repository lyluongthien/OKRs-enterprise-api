import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class addColumnAcceptTokenAfterToUsersTable1594648145882 implements MigrationInterface {
  private acceptTokenAfterColumn: TableColumn = new TableColumn({
    name: 'aceptTokenAfter',
    type: 'timestamptz',
    isNullable: true,
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(TableName.User, this.acceptTokenAfterColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(TableName.User, this.acceptTokenAfterColumn);
  }
}
