import { MigrationInterface, QueryRunner } from "typeorm";

export class AppMigration1701921083318 implements MigrationInterface {
    name = 'AppMigration1701921083318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_999ff821dc2ffb9bcd1e0e22dbe"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "task_id"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "task_status_id"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "taskStatusId"`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "code" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD CONSTRAINT "PK_a795138a264145e8db238bd3e22" PRIMARY KEY ("code")`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "delete_flag" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "task_title" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "task_description" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "delete_flag" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "create_date" TIMESTAMP NOT NULL DEFAULT '"2023-12-07T03:51:26.102Z"'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "update_date" TIMESTAMP NOT NULL DEFAULT '"2023-12-07T03:51:26.102Z"'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "statusId" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "status_name"`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "status_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_a11f0de47a765c6c74ffbd10afa" FOREIGN KEY ("statusId") REFERENCES "task_status"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_a11f0de47a765c6c74ffbd10afa"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "status_name"`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "status_name" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "statusId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "update_date"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "create_date"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "delete_flag"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "task_description"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "task_title"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "delete_flag"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "PK_a795138a264145e8db238bd3e22"`);
        await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "taskStatusId" integer`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "title" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "task_status_id" character varying`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "task_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_status" ADD CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_999ff821dc2ffb9bcd1e0e22dbe" FOREIGN KEY ("taskStatusId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
