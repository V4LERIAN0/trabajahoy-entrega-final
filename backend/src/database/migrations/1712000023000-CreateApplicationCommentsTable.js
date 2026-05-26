export class Migration1712000023000 {
  name = 'Migration1712000023000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "application_comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "application_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "content" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_application_comments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ac_application" FOREIGN KEY ("application_id") REFERENCES "job_applications"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_ac_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_ac_application_id" ON "application_comments" ("application_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_ac_user_id" ON "application_comments" ("user_id")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_application_comments
      BEFORE UPDATE ON "application_comments"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_application_comments ON "application_comments"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ac_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ac_application_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "application_comments"`);
  }
}
