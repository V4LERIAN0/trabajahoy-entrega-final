export class Migration1712000001000 {
  name = 'Migration1712000001000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(50) NOT NULL,
        "description" varchar(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name"),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`INSERT INTO "roles" ("name", "description") VALUES ('admin', 'Administrador del sistema')`);
    await queryRunner.query(`INSERT INTO "roles" ("name", "description") VALUES ('recruiter', 'Reclutador de empresas')`);
    await queryRunner.query(`INSERT INTO "roles" ("name", "description") VALUES ('candidate', 'Candidato buscando empleo')`);
    await queryRunner.query(`INSERT INTO "roles" ("name", "description") VALUES ('moderator', 'Moderador de contenido')`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
  }
}
