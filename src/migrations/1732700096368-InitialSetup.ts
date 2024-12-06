import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1732700096368 implements MigrationInterface {
  name = 'InitialSetup1732700096368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "username" character varying(50) NOT NULL, "password" character varying(300) NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, CONSTRAINT "UQ_USERS_username" UNIQUE ("username"), CONSTRAINT "PK_USERS_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "group_id" uuid NOT NULL, "user_id" uuid NOT NULL, "is_accepted" boolean NOT NULL DEFAULT false, "is_owner" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_GROUP_MEMBERS_user_id" UNIQUE ("user_id"), CONSTRAINT "PK_GROUP_MEMBERS_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_GROUP_MEMBERS_group_id" ON "group_members" ("group_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_GROUP_MEMBERS_group_id_WHERE_is_owner_TRUE" ON "group_members" ("group_id") WHERE "is_owner" = true`,
    );
    await queryRunner.query(
      `CREATE TABLE "family_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "owner_id" uuid NOT NULL, CONSTRAINT "UQ_FAMILY_GROUPS_owner_id" UNIQUE ("owner_id"), CONSTRAINT "REL_bba6844ff647ca7a2226e21461" UNIQUE ("owner_id"), CONSTRAINT "PK_FAMILY_GROUPS_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."groceries_status_enum" AS ENUM('done', 'undone')`,
    );
    await queryRunner.query(
      `CREATE TABLE "groceries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "name" character varying(30) NOT NULL, "status" "public"."groceries_status_enum" NOT NULL DEFAULT 'undone', "priority" character varying NOT NULL DEFAULT 'major', CONSTRAINT "PK_GROCERIES_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_GROCERIES_user_id" ON "groceries" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "endpoint" character varying(300) NOT NULL, "user_agent" character varying(400) NOT NULL, "keys" jsonb NOT NULL, CONSTRAINT "UQ_SUBSCRIPTIONS_user_id" UNIQUE ("user_id"), CONSTRAINT "REL_1d517016ed841168089389a9e0" UNIQUE ("user_id"), CONSTRAINT "PK_SUBSCRIPTIONS_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD CONSTRAINT "FK_GROUP_MEMBERS_group_id_family_groups_id" FOREIGN KEY ("group_id") REFERENCES "family_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD CONSTRAINT "FK_GROUP_MEMBERS_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "family_groups" ADD CONSTRAINT "FK_FAMILY_GROUPS_owner_id_users_id" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groceries" ADD CONSTRAINT "FK_GROCERIES_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_SUBSCRIPTIONS_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_SUBSCRIPTIONS_user_id_users_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groceries" DROP CONSTRAINT "FK_GROCERIES_user_id_users_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "family_groups" DROP CONSTRAINT "FK_FAMILY_GROUPS_owner_id_users_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" DROP CONSTRAINT "FK_GROUP_MEMBERS_user_id_users_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" DROP CONSTRAINT "FK_GROUP_MEMBERS_group_id_family_groups_id"`,
    );
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_GROCERIES_user_id"`);
    await queryRunner.query(`DROP TABLE "groceries"`);
    await queryRunner.query(`DROP TYPE "public"."groceries_status_enum"`);
    await queryRunner.query(`DROP TABLE "family_groups"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_GROUP_MEMBERS_group_id_WHERE_is_owner_TRUE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_GROUP_MEMBERS_group_id"`);
    await queryRunner.query(`DROP TABLE "group_members"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
