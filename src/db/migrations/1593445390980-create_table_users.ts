import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { TableName } from '@app/constants/app.enums';

export class createTableUsers1593445390980 implements MigrationInterface {
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
      },
      {
        name: 'gravatarURL',
        type: 'varchar',
        length: '255',
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
        name: 'roleId',
        type: 'integer',
      },
      {
        name: 'jobPositionId',
        type: 'integer',
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
    queryRunner.createTable(this.usersTable, true);

    //array of foreignkey in table user
    const tableforeignkey = [
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.Role,
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['jobPositionId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.JobPosition,
        onDelete: 'CASCADE',
      }),
    ];

    // Create ForeignKey: roleId
    queryRunner.createForeignKeys(TableName.User, tableforeignkey);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable(this.usersTable);
  }
}
