import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecipeTable1736678636163 implements MigrationInterface {
  name = 'CreateRecipeTable1736678636163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recipes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "author_id" uuid NOT NULL, "title" character varying(100) NOT NULL, "description" character varying(200) NOT NULL, "cooking_method" character varying(2000) NOT NULL, "image_url" character varying(500), "portions_count" integer, CONSTRAINT "PK_RECIPES_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_RECIPES_author_id" ON "recipes" ("author_id") `);
    await queryRunner.query(
      `CREATE TABLE "recipe_ingredients" ("id" SERIAL NOT NULL, "recipe_id" uuid NOT NULL, "name" character varying(50) NOT NULL, "amount" character varying(50) NOT NULL, CONSTRAINT "PK_RECIPE_INGREDIENTS_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_RECIPE_INGREDIENTS_recipe_id" ON "recipe_ingredients" ("recipe_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_RECIPES_author_id_users_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_RECIPE_INGREDIENTS_recipe_id_recipes_id" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_RECIPE_INGREDIENTS_recipe_id_recipes_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" DROP CONSTRAINT "FK_RECIPES_author_id_users_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_RECIPE_INGREDIENTS_recipe_id"`);
    await queryRunner.query(`DROP TABLE "recipe_ingredients"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_RECIPES_author_id"`);
    await queryRunner.query(`DROP TABLE "recipes"`);
  }
}
