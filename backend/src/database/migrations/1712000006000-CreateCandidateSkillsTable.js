export class Migration1712000006000 {
  name = 'Migration1712000006000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "candidate_skill_level_enum" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert')
    `);

    await queryRunner.query(`
      CREATE TABLE "candidate_skills" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "candidate_id" uuid NOT NULL,
        "skill_name" varchar(100) NOT NULL,
        "level" "candidate_skill_level_enum" NOT NULL DEFAULT 'intermediate',
        "years_of_experience" integer DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_skills" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_skills_candidate" FOREIGN KEY ("candidate_id") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_candidate_skills_candidate_id" ON "candidate_skills" ("candidate_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_candidate_skills_skill_name" ON "candidate_skills" ("skill_name")`);
    await queryRunner.query(`CREATE INDEX "IDX_candidate_skills_level" ON "candidate_skills" ("level")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_candidate_skills
      BEFORE UPDATE ON "candidate_skills"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_candidate_skills ON "candidate_skills"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_skills_level"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_skills_skill_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_skills_candidate_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate_skills"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "candidate_skill_level_enum"`);
  }
}
