export class Migration1712000017000 {
  name = 'Migration1712000017000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "vacancy_type_enum" AS ENUM ('full-time', 'part-time', 'contract', 'freelance', 'internship')
    `);

    await queryRunner.query(`
      CREATE TYPE "vacancy_modality_enum" AS ENUM ('remote', 'hybrid', 'onsite')
    `);

    await queryRunner.query(`
      CREATE TYPE "vacancy_level_enum" AS ENUM ('junior', 'mid', 'senior', 'lead', 'manager', 'director')
    `);

    await queryRunner.query(`
      CREATE TYPE "vacancy_status_enum" AS ENUM ('draft', 'published', 'closed', 'archived')
    `);

    await queryRunner.query(`
      CREATE TABLE "vacancies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "category_id" uuid,
        "title" varchar(200) NOT NULL,
        "description" text NOT NULL,
        "requirements" text NOT NULL,
        "benefits_text" text,
        "salary_min" decimal(12, 2),
        "salary_max" decimal(12, 2),
        "currency" varchar(10) DEFAULT 'USD',
        "type" "vacancy_type_enum" NOT NULL DEFAULT 'full-time',
        "modality" "vacancy_modality_enum" NOT NULL DEFAULT 'onsite',
        "level" "vacancy_level_enum" NOT NULL DEFAULT 'mid',
        "status" "vacancy_status_enum" NOT NULL DEFAULT 'draft',
        "country" varchar(100) NOT NULL,
        "city" varchar(100) NOT NULL,
        "location_text" varchar(200),
        "application_deadline" DATE,
        "openings" integer NOT NULL DEFAULT 1,
        "published_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_vacancies" PRIMARY KEY ("id"),
        CONSTRAINT "FK_vacancies_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_vacancies_category" FOREIGN KEY ("category_id") REFERENCES "job_categories"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_vacancies_company_id" ON "vacancies" ("company_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_vacancies_category_id" ON "vacancies" ("category_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_vacancies_status" ON "vacancies" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_vacancies_type" ON "vacancies" ("type")`);
    await queryRunner.query(`CREATE INDEX "IDX_vacancies_modality" ON "vacancies" ("modality")`);
    await queryRunner.query(`CREATE INDEX "IDX_vacancies_level" ON "vacancies" ("level")`);
    await queryRunner.query(`CREATE INDEX "IDX_vacancies_country" ON "vacancies" ("country")`);
    await queryRunner.query(`CREATE INDEX "IDX_vacancies_city" ON "vacancies" ("city")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_vacancies
      BEFORE UPDATE ON "vacancies"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_vacancies ON "vacancies"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancies_city"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancies_country"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancies_level"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancies_modality"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancies_type"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancies_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancies_category_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacancies_company_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vacancies"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "vacancy_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "vacancy_level_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "vacancy_modality_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "vacancy_type_enum"`);
  }
}
