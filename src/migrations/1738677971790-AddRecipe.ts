import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecipe1738677971790 implements MigrationInterface {
  name = 'AddRecipe1738677971790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recipe_ingredients" ("id" SERIAL NOT NULL, "recipe_id" uuid NOT NULL, "name" character varying(50) NOT NULL, "amount" character varying(50) NOT NULL, CONSTRAINT "PK_RECIPE_INGREDIENTS_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_RECIPE_INGREDIENTS_recipe_id" ON "recipe_ingredients" ("recipe_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "recipe_instructions" ("id" SERIAL NOT NULL, "recipe_id" uuid NOT NULL, "step" smallint NOT NULL, "text" character varying(1000) NOT NULL, "video_start_time" character varying(5), "video_end_time" character varying(5), "image_url" character varying(2000), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_RECIPE_INSTRUCTIONS_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_RECIPE_INSTRUCTIONS_recipe_id" ON "recipe_instructions" ("recipe_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "recipes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "author_id" uuid NOT NULL, "title" character varying(100) NOT NULL, "description" character varying(200) NOT NULL, "image_url" character varying(2000), "video_url" character varying(2000), "portions_count" integer, CONSTRAINT "PK_RECIPES_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_RECIPES_author_id" ON "recipes" ("author_id") `);
    await queryRunner.query(
      `ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_RECIPE_INGREDIENTS_recipe_id_recipes_id" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipe_instructions" ADD CONSTRAINT "FK_RECIPE_INSTRUCTIONS_recipe_id_recipes_id" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_RECIPES_author_id_users_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recipes" DROP CONSTRAINT "FK_RECIPES_author_id_users_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipe_instructions" DROP CONSTRAINT "FK_RECIPE_INSTRUCTIONS_recipe_id_recipes_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_RECIPE_INGREDIENTS_recipe_id_recipes_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_RECIPES_author_id"`);
    await queryRunner.query(`DROP TABLE "recipes"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_RECIPE_INSTRUCTIONS_recipe_id"`);
    await queryRunner.query(`DROP TABLE "recipe_instructions"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_RECIPE_INGREDIENTS_recipe_id"`);
    await queryRunner.query(`DROP TABLE "recipe_ingredients"`);
  }
}
