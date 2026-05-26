export class Migration1712000019000 {
  name = 'Migration1712000019000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "vacancy_benefits" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "vacancy_id" uuid NOT NULL,
        "benefit_name" varchar(100) NOT NULL,
        CONSTRAINT "PK_vacancy_benefits" PRIMARY KEY ("id"),
        CONSTRAINT "FK_vacancy_benefits_vacancy" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_vacancy_benefits_vacancy_id" ON "vacancy_benefits" ("vacancy_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancy_benefits_vacancy_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vacancy_benefits"`);
  }
}
