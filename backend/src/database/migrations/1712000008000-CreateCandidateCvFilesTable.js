export class Migration1712000008000 {
  name = 'Migration1712000008000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "candidate_cv_files" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "candidate_id" uuid NOT NULL,
        "file_url" varchar(500) NOT NULL,
        "file_name" varchar(255) NOT NULL,
        "file_size" integer,
        "file_type" varchar(50),
        "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_cv_files" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_cv_files_candidate" FOREIGN KEY ("candidate_id") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_candidate_cv_files_candidate_id" ON "candidate_cv_files" ("candidate_id")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_candidate_cv_files_candidate_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "candidate_cv_files"`);
  }
}
