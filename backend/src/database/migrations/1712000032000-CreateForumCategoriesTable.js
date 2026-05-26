export class Migration1712000032000 {
  name = 'Migration1712000032000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "forum_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "slug" varchar(100) NOT NULL,
        "description" text,
        "icon" varchar(50),
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_forum_categories_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_forum_categories" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_forum_categories_slug" ON "forum_categories" ("slug")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_forum_categories
      BEFORE UPDATE ON "forum_categories"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_forum_categories ON "forum_categories"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_forum_categories_slug"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "forum_categories"`);
  }
}
