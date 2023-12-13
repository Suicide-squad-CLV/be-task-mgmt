import { MigrationInterface, QueryRunner } from "typeorm";

export class AppMigration1702434246384 implements MigrationInterface {
    name = 'AppMigration1702434246384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_status" ADD "background_hex_color" character varying(8) DEFAULT '#ffffff'`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "text_hex_color" character varying(8) DEFAULT '#000000'`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "create_date" TIMESTAMP NOT NULL DEFAULT '"2023-12-13T02:24:09.803Z"'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "create_date" SET DEFAULT '"2023-12-13T02:24:09.803Z"'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "update_date" SET DEFAULT '"2023-12-13T02:24:09.803Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "update_date" SET DEFAULT '2023-12-11 04:31:49.706'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "create_date" SET DEFAULT '2023-12-11 04:31:49.706'`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "create_date"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "text_hex_color"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "background_hex_color"`);
    }

}
