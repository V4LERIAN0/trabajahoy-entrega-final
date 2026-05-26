export class Migration1712000016000 {
  name = 'Migration1712000016000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "job_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "slug" varchar(100) NOT NULL,
        "description" text,
        "parent_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_job_categories_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_job_categories" PRIMARY KEY ("id"),
        CONSTRAINT "FK_job_categories_parent" FOREIGN KEY ("parent_id") REFERENCES "job_categories"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_job_categories_slug" ON "job_categories" ("slug")`);
    await queryRunner.query(`CREATE INDEX "IDX_job_categories_parent_id" ON "job_categories" ("parent_id")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_job_categories
      BEFORE UPDATE ON "job_categories"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_job_categories ON "job_categories"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_job_categories_parent_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_job_categories_slug"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "job_categories"`);
  }
}
