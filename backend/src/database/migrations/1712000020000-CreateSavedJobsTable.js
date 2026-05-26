export class Migration1712000020000 {
  name = 'Migration1712000020000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "saved_jobs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "vacancy_id" uuid NOT NULL,
        "saved_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_saved_jobs_user_vacancy" UNIQUE ("user_id", "vacancy_id"),
        CONSTRAINT "PK_saved_jobs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_saved_jobs_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_saved_jobs_vacancy" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_saved_jobs_user_id" ON "saved_jobs" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_saved_jobs_vacancy_id" ON "saved_jobs" ("vacancy_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_saved_jobs_vacancy_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_saved_jobs_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "saved_jobs"`);
  }
}
