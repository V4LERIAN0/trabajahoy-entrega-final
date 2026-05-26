export class Migration1712000033000 {
  name = 'Migration1712000033000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "forum_thread_status_enum" AS ENUM ('open', 'closed', 'pinned', 'resolved')
    `);

    await queryRunner.query(`
      CREATE TABLE "forum_threads" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "category_id" uuid NOT NULL,
        "author_id" uuid NOT NULL,
        "title" varchar(300) NOT NULL,
        "slug" varchar(300) NOT NULL,
        "content" text NOT NULL,
        "status" "forum_thread_status_enum" NOT NULL DEFAULT 'open',
        "views_count" integer NOT NULL DEFAULT 0,
        "replies_count" integer NOT NULL DEFAULT 0,
        "last_activity_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_forum_threads_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_forum_threads" PRIMARY KEY ("id"),
        CONSTRAINT "FK_forum_threads_category" FOREIGN KEY ("category_id") REFERENCES "forum_categories"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_forum_threads_author" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_forum_threads_category_id" ON "forum_threads" ("category_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_threads_author_id" ON "forum_threads" ("author_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_threads_slug" ON "forum_threads" ("slug")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_threads_status" ON "forum_threads" ("status")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_forum_threads
      BEFORE UPDATE ON "forum_threads"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_forum_threads ON "forum_threads"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_threads_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_threads_slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_threads_author_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_threads_category_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "forum_threads"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "forum_thread_status_enum"`);
  }
}
