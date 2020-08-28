import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class AddColunmChangingTableObjective1598640561480 implements MigrationInterface {
  private changing: TableColumn = new TableColumn({
    name: 'changing',
    type: 'integer',
    default: 0,
  });

  private tableColums: TableColumn[] = [this.changing];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(TableName.Objective, this.tableColums);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(TableName.Objective, this.tableColums);
  }
}
