export class Migration1712000028000 {
  name = 'Migration1712000028000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "resource_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "slug" varchar(100) NOT NULL,
        "description" text,
        "parent_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_resource_categories_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_resource_categories" PRIMARY KEY ("id"),
        CONSTRAINT "FK_resource_categories_parent" FOREIGN KEY ("parent_id") REFERENCES "resource_categories"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_resource_categories_slug" ON "resource_categories" ("slug")`);
    await queryRunner.query(`CREATE INDEX "IDX_resource_categories_parent_id" ON "resource_categories" ("parent_id")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_resource_categories
      BEFORE UPDATE ON "resource_categories"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_resource_categories ON "resource_categories"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resource_categories_parent_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resource_categories_slug"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "resource_categories"`);
  }
}
