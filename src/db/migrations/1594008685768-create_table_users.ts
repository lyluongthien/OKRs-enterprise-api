import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName, ForeignKey } from '@app/constants/app.enums';
import { dropFksToTable, createTableForeignKey } from '@app/libs/migrationSupport';

export class CreateTableUsers1594008685768 implements MigrationInterface {
  private usersTable: Table = new Table({
    name: TableName.User,
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
      },
      {
        name: 'email',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
        length: '255',
      },
      {
        name: 'password',
        type: 'varchar',
        isNullable: false,
        length: '255',
      },
      {
        name: '_salt',
        type: 'varchar',
        length: '255',
        isNullable: true,
      },
      {
        name: 'fullName',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'avatarURL',
        type: 'varchar',
        length: '255',
        isNullable: true,
      },
      {
        name: 'gravatarURL',
        type: 'varchar',
        length: '255',
        isNullable: true,
      },
      {
        name: 'isActive',
        type: 'bool',
        default: false,
      },
      {
        name: 'isApproved',
        type: 'bool',
        default: false,
      },
      {
        name: ForeignKey.ROLE_ID,
        type: 'integer',
        isNullable: true,
      },
      {
        name: ForeignKey.JOB_POSITION_ID,
        type: 'integer',
        isNullable: true,
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
        name: 'deactivatedAt',
        type: 'timestamptz',
        isNullable: true,
      },
    ],
  });

  private pkRoleId: TableForeignKey = createTableForeignKey(
    [ForeignKey.ROLE_ID],
    TableName.Role,
    'CASCADE',
  ) as TableForeignKey;

  private pkobPosId: TableForeignKey = createTableForeignKey(
    [ForeignKey.JOB_POSITION_ID],
    TableName.JobPosition,
    'CASCADE',
  ) as TableForeignKey;

  private tableForeignKey: TableForeignKey[] = [this.pkRoleId, this.pkobPosId];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.usersTable, true);
    await queryRunner.createForeignKeys(TableName.User, this.tableForeignKey);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropFksToTable(queryRunner, TableName.User, [ForeignKey.ROLE_ID, ForeignKey.JOB_POSITION_ID]);
    await queryRunner.dropTable(this.usersTable, true);
  }
}
