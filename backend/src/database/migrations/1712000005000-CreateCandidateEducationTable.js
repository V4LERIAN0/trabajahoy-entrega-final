export class Migration1712000005000 {
  name = 'Migration1712000005000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "candidate_education" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "candidate_id" uuid NOT NULL,
        "institution" varchar(200) NOT NULL,
        "degree" varchar(100) NOT NULL,
        "field_of_study" varchar(200),
        "start_date" DATE NOT NULL,
        "end_date" DATE,
        "grade" varchar(50),
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_education" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_education_candidate" FOREIGN KEY ("candidate_id") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_candidate_education_candidate_id" ON "candidate_education" ("candidate_id")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_candidate_education
      BEFORE UPDATE ON "candidate_education"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_candidate_education ON "candidate_education"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_education_candidate_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate_education"`);
  }
}
