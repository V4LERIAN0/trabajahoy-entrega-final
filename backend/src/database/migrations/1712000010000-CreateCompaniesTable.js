export class Migration1712000010000 {
  name = 'Migration1712000010000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "owner_id" uuid NOT NULL,
        "name" varchar(200) NOT NULL,
        "description" text,
        "website" varchar(500),
        "industry" varchar(100),
        "size" varchar(20),
        "logo_url" varchar(500),
        "cover_url" varchar(500),
        "email" varchar(255),
        "phone" varchar(20),
        "is_verified" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_companies_name" UNIQUE ("name"),
        CONSTRAINT "PK_companies" PRIMARY KEY ("id"),
        CONSTRAINT "FK_companies_owner" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_companies_owner_id" ON "companies" ("owner_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_companies_is_verified" ON "companies" ("is_verified")`);
    await queryRunner.query(`CREATE INDEX "IDX_companies_industry" ON "companies" ("industry")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_companies
      BEFORE UPDATE ON "companies"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_companies ON "companies"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_companies_industry"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_companies_is_verified"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_companies_owner_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "companies"`);
  }
}
