export class Migration1712000021000 {
  name = 'Migration1712000021000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "application_status_enum" AS ENUM ('pending', 'reviewed', 'interview', 'accepted', 'rejected')
    `);

    await queryRunner.query(`
      CREATE TABLE "job_applications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "vacancy_id" uuid NOT NULL,
        "status" "application_status_enum" NOT NULL DEFAULT 'pending',
        "cover_letter" text,
        "cv_file_url" varchar(500),
        "resume_url" varchar(500),
        "applied_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_job_applications" PRIMARY KEY ("id"),
        CONSTRAINT "FK_job_applications_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_job_applications_vacancy" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_job_applications_user_id" ON "job_applications" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_job_applications_vacancy_id" ON "job_applications" ("vacancy_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_job_applications_status" ON "job_applications" ("status")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_job_applications
      BEFORE UPDATE ON "job_applications"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_job_applications ON "job_applications"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_job_applications_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_job_applications_vacancy_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_job_applications_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "job_applications"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "application_status_enum"`);
  }
}
