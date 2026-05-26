export class Migration1712000002000 {
  name = 'Migration1712000002000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        "assigned_by" uuid,
        "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_roles_user_role" UNIQUE ("user_id", "role_id"),
        CONSTRAINT "PK_user_roles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_roles_assigned_by" FOREIGN KEY ("assigned_by") REFERENCES "profiles"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_user_roles_user_id" ON "user_roles" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_roles_role_id" ON "user_roles" ("role_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_roles_role_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_roles_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`);
  }
}
