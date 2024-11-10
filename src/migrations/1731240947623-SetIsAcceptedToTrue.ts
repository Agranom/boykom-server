import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetIsAcceptedToTrue1731240947623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "group_members" SET is_accepted = true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "group_members" SET is_accepted = false`);
  }
}
