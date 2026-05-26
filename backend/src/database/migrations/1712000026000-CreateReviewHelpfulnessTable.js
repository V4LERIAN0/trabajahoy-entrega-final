export class Migration1712000026000 {
  name = 'Migration1712000026000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "review_helpfulness" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "review_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "is_helpful" boolean NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_review_helpfulness_review_user" UNIQUE ("review_id", "user_id"),
        CONSTRAINT "PK_review_helpfulness" PRIMARY KEY ("id"),
        CONSTRAINT "FK_review_helpfulness_review" FOREIGN KEY ("review_id") REFERENCES "company_reviews"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_review_helpfulness_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_review_helpfulness_review_id" ON "review_helpfulness" ("review_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_review_helpfulness_user_id" ON "review_helpfulness" ("user_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_helpfulness_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_helpfulness_review_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "review_helpfulness"`);
  }
}
