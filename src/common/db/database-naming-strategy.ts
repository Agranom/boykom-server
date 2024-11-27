import { Table } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class DatabaseNamingStrategy extends SnakeNamingStrategy {
  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return `PK_${this.getTableName(tableOrName)}_${this.joinColumns(columnNames)}`;
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return `UQ_${this.getTableName(tableOrName)}_${this.joinColumns(columnNames)}`;
  }

  foreignKeyName(
    referencingTableOrName: Table | string,
    referencingColumnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    const referencingTableName = this.getTableName(referencingTableOrName);

    const referencingReferencedGroup = referencingColumnNames.map((referencingColumn, index) => {
      return `${referencingTableName}_${referencingColumn}_${referencedTablePath}_${
        referencedColumnNames ? referencedColumnNames[index] : ''
      }`;
    });

    return `FK_${referencingReferencedGroup.join('_')}`;
  }

  indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    if (where) {
      return super.indexName(tableOrName, columnNames, where);
    }

    return `IDX_${this.getTableName(tableOrName)}_${this.joinColumns(columnNames)}`;
  }

  protected getTableName(tableOrName: Table | string): string {
    return super.getTableName(tableOrName).toUpperCase();
  }

  private joinColumns(columnNames: string[]): string {
    return columnNames.join('_');
  }
}
