export class Migration1776800002000 {
  name = 'Migration1776800002000';

  async up(queryRunner) {
    await queryRunner.query(`
      INSERT INTO "roles" ("name", "description")
      SELECT 'company_admin', 'Administrador de empresa'
      WHERE NOT EXISTS (
        SELECT 1 FROM "roles" WHERE "name" = 'company_admin'
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DELETE FROM "user_roles"
      WHERE "role_id" IN (
        SELECT "id" FROM "roles" WHERE "name" = 'company_admin'
      )
    `);

    await queryRunner.query(`DELETE FROM "roles" WHERE "name" = 'company_admin'`);
  }
}
