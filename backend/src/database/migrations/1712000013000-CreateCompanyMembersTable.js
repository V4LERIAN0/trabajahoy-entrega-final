export class Migration1712000013000 {
  name = 'Migration1712000013000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TYPE "company_member_role_enum" AS ENUM ('owner', 'admin', 'recruiter')
    `);

    await queryRunner.query(`
      CREATE TABLE "company_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "role" "company_member_role_enum" NOT NULL DEFAULT 'recruiter',
        "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_company_members_company_user" UNIQUE ("company_id", "user_id"),
        CONSTRAINT "PK_company_members" PRIMARY KEY ("id"),
        CONSTRAINT "FK_company_members_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_company_members_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_company_members_company_id" ON "company_members" ("company_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_company_members_user_id" ON "company_members" ("user_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_company_members_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_company_members_company_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "company_members"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "company_member_role_enum"`);
  }
}
