import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToUsername1731240081810 implements MigrationInterface {
  name = 'AddUniqueConstraintToUsername1731240081810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_username" UNIQUE ("username")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_username"`);
  }
}
