import { TableForeignKey, QueryRunner } from 'typeorm';

export const dropFksToTable = async (queryRunner: QueryRunner, tableName: string, fksName: string[]): Promise<void> => {
  const FKs: TableForeignKey[] = [];
  const table = await queryRunner.getTable(tableName);
  if (fksName.length === 1) {
    const tableFK = table.foreignKeys.find((fk) => fk.columnNames.indexOf(fksName[0]) !== -1);
    await queryRunner.dropForeignKey(table, tableFK);
  }
  for (const fkName of fksName) {
    const tableFK = table.foreignKeys.find((fk) => fk.columnNames.indexOf(fkName) !== -1);
    FKs.push(tableFK);
  }
  await queryRunner.dropForeignKeys(table, FKs);
};
