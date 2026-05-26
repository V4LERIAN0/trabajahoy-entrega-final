export class Migration1712000011000 {
  name = 'Migration1712000011000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "company_locations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "country" varchar(100) NOT NULL,
        "city" varchar(100) NOT NULL,
        "address" varchar(300),
        "is_headquarters" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_company_locations" PRIMARY KEY ("id"),
        CONSTRAINT "FK_company_locations_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_company_locations_company_id" ON "company_locations" ("company_id")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_company_locations
      BEFORE UPDATE ON "company_locations"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_company_locations ON "company_locations"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_company_locations_company_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "company_locations"`);
  }
}
