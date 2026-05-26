export class Migration1712000027000 {
  name = 'Migration1712000027000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "report_status_enum" AS ENUM ('pending', 'resolved', 'dismissed')
    `);

    await queryRunner.query(`
      CREATE TABLE "review_reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "review_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "reason" varchar(200) NOT NULL,
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "status" "report_status_enum" NOT NULL DEFAULT 'pending',
        CONSTRAINT "PK_review_reports" PRIMARY KEY ("id"),
        CONSTRAINT "FK_review_reports_review" FOREIGN KEY ("review_id") REFERENCES "company_reviews"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_review_reports_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_review_reports_review_id" ON "review_reports" ("review_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_review_reports_user_id" ON "review_reports" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_review_reports_status" ON "review_reports" ("status")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_reports_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_reports_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_reports_review_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "review_reports"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "report_status_enum"`);
  }
}
