export class Migration1776800001000 {
  name = 'Migration1776800001000';

  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TYPE "company_member_role_enum"
      RENAME VALUE 'admin' TO 'company_admin'
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TYPE "company_member_role_enum"
      RENAME VALUE 'company_admin' TO 'admin'
    `);
  }
}
