export class Migration1712000022000 {
  name = 'Migration1712000022000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "application_status_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "application_id" uuid NOT NULL,
        "from_status" "application_status_enum",
        "to_status" "application_status_enum" NOT NULL,
        "changed_by" uuid,
        "changed_at" TIMESTAMP NOT NULL DEFAULT now(),
        "notes" text,
        CONSTRAINT "PK_application_status_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ash_application" FOREIGN KEY ("application_id") REFERENCES "job_applications"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_ash_changed_by" FOREIGN KEY ("changed_by") REFERENCES "profiles"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_ash_application_id" ON "application_status_history" ("application_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ash_application_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "application_status_history"`);
  }
}
