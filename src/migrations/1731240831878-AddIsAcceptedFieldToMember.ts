import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAcceptedFieldToMember1731240831878 implements MigrationInterface {
  name = 'AddIsAcceptedFieldToMember1731240831878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD "is_accepted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group_members" DROP COLUMN "is_accepted"`);
  }
}
