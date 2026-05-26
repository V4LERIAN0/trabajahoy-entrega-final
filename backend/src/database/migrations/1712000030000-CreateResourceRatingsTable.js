export class Migration1712000030000 {
  name = 'Migration1712000030000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "resource_ratings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "resource_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "rating" integer NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_resource_ratings_resource_user" UNIQUE ("resource_id", "user_id"),
        CONSTRAINT "PK_resource_ratings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_resource_ratings_resource" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_resource_ratings_user" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_resource_ratings_resource_id" ON "resource_ratings" ("resource_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_resource_ratings_user_id" ON "resource_ratings" ("user_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resource_ratings_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resource_ratings_resource_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "resource_ratings"`);
  }
}
