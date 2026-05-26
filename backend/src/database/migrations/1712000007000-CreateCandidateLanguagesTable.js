export class Migration1712000007000 {
  name = 'Migration1712000007000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "language_proficiency_enum" AS ENUM ('basic', 'intermediate', 'advanced', 'native')
    `);

    await queryRunner.query(`
      CREATE TABLE "candidate_languages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "candidate_id" uuid NOT NULL,
        "language_name" varchar(100) NOT NULL,
        "proficiency" "language_proficiency_enum" NOT NULL DEFAULT 'intermediate',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_languages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_languages_candidate" FOREIGN KEY ("candidate_id") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_candidate_languages_candidate_id" ON "candidate_languages" ("candidate_id")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_candidate_languages
      BEFORE UPDATE ON "candidate_languages"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_candidate_languages ON "candidate_languages"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_languages_candidate_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate_languages"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "language_proficiency_enum"`);
  }
}
