export class Migration1712000029000 {
  name = 'Migration1712000029000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "resource_type_enum" AS ENUM ('article', 'guide', 'video', 'podcast', 'template')
    `);

    await queryRunner.query(`
      CREATE TYPE "resource_status_enum" AS ENUM ('draft', 'published')
    `);

    await queryRunner.query(`
      CREATE TABLE "resources" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "category_id" uuid,
        "author_id" uuid NOT NULL,
        "title" varchar(300) NOT NULL,
        "slug" varchar(300) NOT NULL,
        "content" text NOT NULL,
        "summary" varchar(500),
        "cover_url" varchar(500),
        "type" "resource_type_enum" NOT NULL DEFAULT 'article',
        "status" "resource_status_enum" NOT NULL DEFAULT 'draft',
        "published_at" TIMESTAMP,
        "views_count" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_resources_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_resources" PRIMARY KEY ("id"),
        CONSTRAINT "FK_resources_category" FOREIGN KEY ("category_id") REFERENCES "resource_categories"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_resources_author" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_resources_category_id" ON "resources" ("category_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_resources_author_id" ON "resources" ("author_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_resources_slug" ON "resources" ("slug")`);
    await queryRunner.query(`CREATE INDEX "IDX_resources_status" ON "resources" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_resources_type" ON "resources" ("type")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_resources
      BEFORE UPDATE ON "resources"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_resources ON "resources"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resources_type"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resources_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resources_slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resources_author_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resources_category_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "resources"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "resource_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "resource_type_enum"`);
  }
}
