import { MigrationInterface, QueryRunner } from "typeorm";

export class AppMigration1702269106872 implements MigrationInterface {
    name = 'AppMigration1702269106872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_status" RENAME COLUMN "code" TO "id"`);
        await queryRunner.query(`ALTER TABLE "task_status" RENAME CONSTRAINT "PK_a795138a264145e8db238bd3e22" TO "PK_b8747cc6a41b6cef4639babf61d"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_a11f0de47a765c6c74ffbd10afa"`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "create_date" SET DEFAULT '"2023-12-11T04:31:49.706Z"'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "update_date" SET DEFAULT '"2023-12-11T04:31:49.706Z"'`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "statusId"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "statusId" uuid`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_a11f0de47a765c6c74ffbd10afa" FOREIGN KEY ("statusId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_a11f0de47a765c6c74ffbd10afa"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "id" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "statusId"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "statusId" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "update_date" SET DEFAULT '2023-12-07 03:51:26.102'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "create_date" SET DEFAULT '2023-12-07 03:51:26.102'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_a11f0de47a765c6c74ffbd10afa" FOREIGN KEY ("statusId") REFERENCES "task_status"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_status" RENAME CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d" TO "PK_a795138a264145e8db238bd3e22"`);
        await queryRunner.query(`ALTER TABLE "task_status" RENAME COLUMN "id" TO "code"`);
    }

}
