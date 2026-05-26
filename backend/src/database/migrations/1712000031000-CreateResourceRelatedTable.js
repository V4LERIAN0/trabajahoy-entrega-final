export class Migration1712000031000 {
  name = 'Migration1712000031000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "resource_related" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "resource_id" uuid NOT NULL,
        "related_resource_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_resource_related_pair" UNIQUE ("resource_id", "related_resource_id"),
        CONSTRAINT "PK_resource_related" PRIMARY KEY ("id"),
        CONSTRAINT "FK_resource_related_resource" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_resource_related_related_resource" FOREIGN KEY ("related_resource_id") REFERENCES "resources"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_resource_related_resource_id" ON "resource_related" ("resource_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_resource_related_related_resource_id" ON "resource_related" ("related_resource_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resource_related_related_resource_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_resource_related_resource_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "resource_related"`);
  }
}
