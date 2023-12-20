import { MigrationInterface, QueryRunner } from "typeorm";

export class AppMigration1701915112192 implements MigrationInterface {
    name = 'AppMigration1701915112192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "deletedAt" TO "is_deleted"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "is_deleted" TO "deletedAt"`);
    }

}
