export class Migration1712000024000 {
  name = 'Migration1712000024000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "candidate_company_follows" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "company_id" uuid NOT NULL,
        "followed_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_ccf_user_company" UNIQUE ("user_id", "company_id"),
        CONSTRAINT "PK_candidate_company_follows" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ccf_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_ccf_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_ccf_user_id" ON "candidate_company_follows" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_ccf_company_id" ON "candidate_company_follows" ("company_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ccf_company_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ccf_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate_company_follows"`);
  }
}
