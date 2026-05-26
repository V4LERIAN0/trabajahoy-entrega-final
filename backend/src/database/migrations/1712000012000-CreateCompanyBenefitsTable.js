export class Migration1712000012000 {
  name = 'Migration1712000012000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "company_benefits" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "name" varchar(100) NOT NULL,
        "description" text,
        "icon" varchar(50),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_company_benefits" PRIMARY KEY ("id"),
        CONSTRAINT "FK_company_benefits_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_company_benefits_company_id" ON "company_benefits" ("company_id")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_company_benefits
      BEFORE UPDATE ON "company_benefits"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_company_benefits ON "company_benefits"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_company_benefits_company_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "company_benefits"`);
  }
}
