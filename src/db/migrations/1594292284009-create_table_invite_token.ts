import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class CreateTableInviteToken1594292284009 implements MigrationInterface {
  private inviteTokenTable: Table = new Table({
    name: TableName.InviteToken,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
      {
        name: 'token',
        type: 'varchar',
        isNullable: false,
        length: '255',
      },
      {
        name: 'createdAt',
        type: 'timestamptz',
        default: 'now()',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.inviteTokenTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.inviteTokenTable);
  }
}
