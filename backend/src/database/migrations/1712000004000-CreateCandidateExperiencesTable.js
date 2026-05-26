export class Migration1712000004000 {
  name = 'Migration1712000004000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "candidate_experiences" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "candidate_id" uuid NOT NULL,
        "company_name" varchar(200) NOT NULL,
        "role" varchar(200) NOT NULL,
        "description" text,
        "start_date" DATE NOT NULL,
        "end_date" DATE,
        "is_current" boolean NOT NULL DEFAULT false,
        "location" varchar(200),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_experiences" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_experiences_candidate" FOREIGN KEY ("candidate_id") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_candidate_experiences_candidate_id" ON "candidate_experiences" ("candidate_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_candidate_experiences_is_current" ON "candidate_experiences" ("is_current")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_candidate_experiences
      BEFORE UPDATE ON "candidate_experiences"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_candidate_experiences ON "candidate_experiences"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_experiences_is_current"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_experiences_candidate_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate_experiences"`);
  }
}
