export class Migration1712000034000 {
  name = 'Migration1712000034000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "forum_posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "thread_id" uuid NOT NULL,
        "author_id" uuid NOT NULL,
        "content" text NOT NULL,
        "is_solution" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_forum_posts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_forum_posts_thread" FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_forum_posts_author" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_forum_posts_thread_id" ON "forum_posts" ("thread_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_posts_author_id" ON "forum_posts" ("author_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_posts_is_solution" ON "forum_posts" ("is_solution")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_forum_posts
      BEFORE UPDATE ON "forum_posts"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_forum_posts ON "forum_posts"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_posts_is_solution"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_posts_author_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_posts_thread_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "forum_posts"`);
  }
}
