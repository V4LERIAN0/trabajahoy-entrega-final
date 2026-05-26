export class Migration1712000018000 {
  name = 'Migration1712000018000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "vacancy_skills" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "vacancy_id" uuid NOT NULL,
        "skill_name" varchar(100) NOT NULL,
        "is_required" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_vacancy_skills" PRIMARY KEY ("id"),
        CONSTRAINT "FK_vacancy_skills_vacancy" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_vacancy_skills_vacancy_id" ON "vacancy_skills" ("vacancy_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancy_skills_vacancy_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vacancy_skills"`);
  }
}
