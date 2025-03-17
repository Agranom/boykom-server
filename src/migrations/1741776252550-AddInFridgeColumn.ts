import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInFridgeColumn1741776252550 implements MigrationInterface {
  name = 'AddInFridgeColumn1741776252550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groceries" ADD "in_fridge" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "groceries" DROP COLUMN "in_fridge"`);
  }
}
