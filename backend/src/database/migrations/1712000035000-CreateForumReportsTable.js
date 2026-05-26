export class Migration1712000035000 {
  name = 'Migration1712000035000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "forum_reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "post_id" uuid,
        "thread_id" uuid,
        "user_id" uuid NOT NULL,
        "reason" varchar(200) NOT NULL,
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "status" "report_status_enum" NOT NULL DEFAULT 'pending',
        CONSTRAINT "PK_forum_reports" PRIMARY KEY ("id"),
        CONSTRAINT "FK_forum_reports_post" FOREIGN KEY ("post_id") REFERENCES "forum_posts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_forum_reports_thread" FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_forum_reports_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_forum_reports_target" CHECK ("post_id" IS NOT NULL OR "thread_id" IS NOT NULL)
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_forum_reports_post_id" ON "forum_reports" ("post_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_reports_thread_id" ON "forum_reports" ("thread_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_reports_user_id" ON "forum_reports" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_reports_status" ON "forum_reports" ("status")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_reports_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_reports_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_reports_thread_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_reports_post_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "forum_reports"`);
  }
}
