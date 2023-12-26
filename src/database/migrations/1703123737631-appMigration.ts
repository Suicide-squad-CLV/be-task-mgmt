import { MigrationInterface, QueryRunner } from "typeorm";

export class AppMigration1703123737631 implements MigrationInterface {
    name = 'AppMigration1703123737631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_status" ADD "persisted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "task_status"."persisted" IS 'Allow to delete data'`);
        await queryRunner.query(`ALTER TABLE "task_status" ALTER COLUMN "create_date" SET DEFAULT '"2023-12-21T01:55:41.259Z"'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "create_date" SET DEFAULT '"2023-12-21T01:55:41.259Z"'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "update_date" SET DEFAULT '"2023-12-21T01:55:41.259Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "update_date" SET DEFAULT '2023-12-13 02:24:09.803'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "create_date" SET DEFAULT '2023-12-13 02:24:09.803'`);
        await queryRunner.query(`ALTER TABLE "task_status" ALTER COLUMN "create_date" SET DEFAULT '2023-12-13 02:24:09.803'`);
        await queryRunner.query(`COMMENT ON COLUMN "task_status"."persisted" IS 'Allow to delete data'`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "persisted"`);
    }

}
