export class AddInterviewFieldsToJobApplications1776800000000 {
  name = 'AddInterviewFieldsToJobApplications1776800000000';

  async up(queryRunner) {
    // Add interview columns if they don't already exist
    await queryRunner.query(`
      ALTER TABLE "job_applications"
        ADD COLUMN IF NOT EXISTS "interview_scheduled_at" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "interview_location" varchar(500),
        ADD COLUMN IF NOT EXISTS "interview_notes" text
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "interview_notes"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "interview_location"`);
    await queryRunner.query(`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "interview_scheduled_at"`);
  }
}
