import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVersionColumnToGrocery1734530057341 implements MigrationInterface {
  name = 'AddVersionColumnToGrocery1734530057341';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "groceries" ADD "version" integer NOT NULL DEFAULT '1'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "groceries" DROP COLUMN "version"`);
  }
}
