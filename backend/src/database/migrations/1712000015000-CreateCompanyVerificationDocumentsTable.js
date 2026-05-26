export class Migration1712000015000 {
  name = 'Migration1712000015000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "company_verification_documents" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "submission_id" uuid NOT NULL,
        "document_type" varchar(100) NOT NULL,
        "file_url" varchar(500) NOT NULL,
        "status" "verification_status_enum" NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_company_verification_documents" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cvd_submission" FOREIGN KEY ("submission_id") REFERENCES "company_verification_submissions"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_cvd_submission_id" ON "company_verification_documents" ("submission_id")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_cvd
      BEFORE UPDATE ON "company_verification_documents"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_cvd ON "company_verification_documents"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cvd_submission_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "company_verification_documents"`);
  }
}
