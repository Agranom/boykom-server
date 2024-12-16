import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGroceryCategory1734022707925 implements MigrationInterface {
  name = 'AddGroceryCategory1734022707925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."groceries_category_enum" AS ENUM('fruits', 'vegetables', 'household_goods', 'personal_care', 'dairy', 'meat', 'seafood', 'pantry_staples', 'canned_goods', 'bakery', 'beverages', 'alcohol', 'spices', 'oils', 'hygiene_products', 'unknown')`,
    );
    await queryRunner.query(
      `ALTER TABLE "groceries" ADD "category" "public"."groceries_category_enum" NOT NULL DEFAULT 'unknown'`,
    );
    await queryRunner.query(`ALTER TABLE "groceries" DROP COLUMN "priority"`);
    await queryRunner.query(
      `CREATE TYPE "public"."groceries_priority_enum" AS ENUM('major', 'medium', 'low')`,
    );
    await queryRunner.query(
      `ALTER TABLE "groceries" ADD "priority" "public"."groceries_priority_enum" NOT NULL DEFAULT 'major'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "groceries" DROP COLUMN "priority"`);
    await queryRunner.query(`DROP TYPE "public"."groceries_priority_enum"`);
    await queryRunner.query(
      `ALTER TABLE "groceries" ADD "priority" character varying NOT NULL DEFAULT 'major'`,
    );
    await queryRunner.query(`ALTER TABLE "groceries" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "public"."groceries_category_enum"`);
  }
}
