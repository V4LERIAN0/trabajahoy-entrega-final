export class Migration1712000037000 {
  name = 'Migration1712000037000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "alert_frequency_enum" AS ENUM ('daily', 'weekly')
    `);

    await queryRunner.query(`
      CREATE TABLE "job_alerts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "keywords" text[],
        "location" varchar(200),
        "type" "vacancy_type_enum",
        "modality" "vacancy_modality_enum",
        "level" "vacancy_level_enum",
        "frequency" "alert_frequency_enum" NOT NULL DEFAULT 'daily',
        "is_active" boolean NOT NULL DEFAULT true,
        "last_sent_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_job_alerts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_job_alerts_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_job_alerts_user_id" ON "job_alerts" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_job_alerts_is_active" ON "job_alerts" ("is_active")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_job_alerts
      BEFORE UPDATE ON "job_alerts"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_job_alerts ON "job_alerts"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_job_alerts_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_job_alerts_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "job_alerts"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "alert_frequency_enum"`);
  }
}
