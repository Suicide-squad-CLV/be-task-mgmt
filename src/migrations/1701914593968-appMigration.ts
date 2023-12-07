import { MigrationInterface, QueryRunner } from "typeorm";

export class AppMigration1701914593968 implements MigrationInterface {
    name = 'AppMigration1701914593968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refresh_token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "refresh_token" SET NOT NULL`);
    }

}
