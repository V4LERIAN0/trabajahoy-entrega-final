export class Migration1712000003000 {
  name = 'Migration1712000003000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "candidate_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "bio" text,
        "headline" varchar(200),
        "summary" text,
        "avatar_url" varchar(500),
        "location" varchar(200),
        "country" varchar(100),
        "city" varchar(100),
        "website" varchar(500),
        "availability" varchar(50) DEFAULT 'available',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_candidate_profiles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_candidate_profiles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_profiles_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_candidate_profiles_user_id" ON "candidate_profiles" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_candidate_profiles_availability" ON "candidate_profiles" ("availability")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_candidate_profiles
      BEFORE UPDATE ON "candidate_profiles"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_candidate_profiles ON "candidate_profiles"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_profiles_availability"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_profiles_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate_profiles"`);
  }
}
