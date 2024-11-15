import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsOwnerField1731685514227 implements MigrationInterface {
  name = 'AddIsOwnerField1731685514227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD "is_owner" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" DROP CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" DROP CONSTRAINT "FK_20a555b299f75843aa53ff8b0ee"`,
    );
    await queryRunner.query(`ALTER TABLE "group_members" ALTER COLUMN "group_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "group_members" ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "family_groups" DROP CONSTRAINT "FK_8e7e95724846a2df9eec8376a4f"`,
    );
    await queryRunner.query(`ALTER TABLE "family_groups" ALTER COLUMN "owner_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "family_groups" ADD CONSTRAINT "UQ_8e7e95724846a2df9eec8376a4f" UNIQUE ("owner_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a5df9a191b80fa5880f48abacb" ON "group_members" ("group_id") WHERE "is_owner" = true`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD CONSTRAINT "UQ_f5939ee0ad233ad35e03f5c65c1" UNIQUE ("group_id", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e" FOREIGN KEY ("group_id") REFERENCES "family_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD CONSTRAINT "FK_20a555b299f75843aa53ff8b0ee" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "family_groups" ADD CONSTRAINT "FK_8e7e95724846a2df9eec8376a4f" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "family_groups" DROP CONSTRAINT "FK_8e7e95724846a2df9eec8376a4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" DROP CONSTRAINT "FK_20a555b299f75843aa53ff8b0ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" DROP CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" DROP CONSTRAINT "UQ_f5939ee0ad233ad35e03f5c65c1"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_a5df9a191b80fa5880f48abacb"`);
    await queryRunner.query(
      `ALTER TABLE "family_groups" DROP CONSTRAINT "UQ_8e7e95724846a2df9eec8376a4f"`,
    );
    await queryRunner.query(`ALTER TABLE "family_groups" ALTER COLUMN "owner_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "family_groups" ADD CONSTRAINT "FK_8e7e95724846a2df9eec8376a4f" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "group_members" ALTER COLUMN "user_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "group_members" ALTER COLUMN "group_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD CONSTRAINT "FK_20a555b299f75843aa53ff8b0ee" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e" FOREIGN KEY ("group_id") REFERENCES "family_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "group_members" DROP COLUMN "is_owner"`);
  }
}
