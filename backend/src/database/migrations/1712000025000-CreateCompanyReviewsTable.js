export class Migration1712000025000 {
  name = 'Migration1712000025000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "review_status_enum" AS ENUM ('pending', 'approved', 'rejected')
    `);

    await queryRunner.query(`
      CREATE TABLE "company_reviews" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "company_id" uuid NOT NULL,
        "overall_rating" integer NOT NULL CHECK ("overall_rating" >= 1 AND "overall_rating" <= 5),
        "work_life_balance" integer CHECK ("work_life_balance" >= 1 AND "work_life_balance" <= 5),
        "compensation" integer CHECK ("compensation" >= 1 AND "compensation" <= 5),
        "culture" integer CHECK ("culture" >= 1 AND "culture" <= 5),
        "management_rating" integer CHECK ("management_rating" >= 1 AND "management_rating" <= 5),
        "career_opportunities" integer CHECK ("career_opportunities" >= 1 AND "career_opportunities" <= 5),
        "title" varchar(200),
        "pros" text,
        "cons" text,
        "review_date" DATE NOT NULL,
        "is_anonymous" boolean NOT NULL DEFAULT false,
        "status" "review_status_enum" NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_company_reviews" PRIMARY KEY ("id"),
        CONSTRAINT "FK_company_reviews_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_company_reviews_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_company_reviews_user_id" ON "company_reviews" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_company_reviews_company_id" ON "company_reviews" ("company_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_company_reviews_status" ON "company_reviews" ("status")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_company_reviews
      BEFORE UPDATE ON "company_reviews"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_company_reviews ON "company_reviews"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_company_reviews_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_company_reviews_company_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_company_reviews_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "company_reviews"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "review_status_enum"`);
  }
}
