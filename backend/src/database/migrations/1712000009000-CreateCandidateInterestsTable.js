export class Migration1712000009000 {
  name = 'Migration1712000009000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "candidate_interests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "candidate_id" uuid NOT NULL,
        "tag_name" varchar(100) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_interests" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_interests_candidate" FOREIGN KEY ("candidate_id") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_candidate_interests_candidate_id" ON "candidate_interests" ("candidate_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_candidate_interests_tag_name" ON "candidate_interests" ("tag_name")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_interests_tag_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_interests_candidate_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate_interests"`);
  }
}
