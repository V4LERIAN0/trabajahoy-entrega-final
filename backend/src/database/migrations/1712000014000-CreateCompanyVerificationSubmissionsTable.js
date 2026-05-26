export class Migration1712000014000 {
  name = 'Migration1712000014000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "verification_status_enum" AS ENUM ('pending', 'approved', 'rejected')
    `);

    await queryRunner.query(`
      CREATE TABLE "company_verification_submissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "status" "verification_status_enum" NOT NULL DEFAULT 'pending',
        "submitted_at" TIMESTAMP NOT NULL DEFAULT now(),
        "reviewed_at" TIMESTAMP,
        "reviewed_by" uuid,
        "notes" text,
        CONSTRAINT "PK_company_verification_submissions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cvs_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_cvs_reviewed_by" FOREIGN KEY ("reviewed_by") REFERENCES "profiles"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_cvs_company_id" ON "company_verification_submissions" ("company_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_cvs_status" ON "company_verification_submissions" ("status")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cvs_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cvs_company_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "company_verification_submissions"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "verification_status_enum"`);
  }
}
