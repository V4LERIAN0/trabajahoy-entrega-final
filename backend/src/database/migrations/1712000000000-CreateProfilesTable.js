export class Migration1712000000000 {
  name = 'Migration1712000000000';

  async up(queryRunner) {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TABLE "profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "first_name" varchar(100),
        "last_name" varchar(100),
        "avatar_url" varchar(500),
        "phone" varchar(20),
        "is_active" boolean NOT NULL DEFAULT true,
        "is_verified" boolean NOT NULL DEFAULT false,
        "email_verified_at" TIMESTAMP,
        "last_login_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_profiles_email" UNIQUE ("email"),
        CONSTRAINT "PK_profiles" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_profiles_email" ON "profiles" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_profiles_is_active" ON "profiles" ("is_active")`);

    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_profiles
      BEFORE UPDATE ON "profiles"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_updated_at_profiles ON "profiles"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_profiles_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_profiles_email"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "profiles"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at()`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
