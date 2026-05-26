import { EntitySchema } from "typeorm";

export const VacancySkill = new EntitySchema({
  name: "VacancySkill",
  tableName: "vacancy_skills",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    vacancyId: {
      name: "vacancy_id",
      type: "uuid",
      nullable: false,
    },
    skillName: {
      name: "skill_name",
      type: "varchar",
      length: 100,
      nullable: false,
    },
    isRequired: {
      name: "is_required",
      type: "boolean",
      nullable: false,
      default: true,
    },
  },
  relations: {
    vacancy: {
      type: "many-to-one",
      target: "Vacancy",
      joinColumn: {
        name: "vacancy_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_vacancy_skills_vacancy_id",
      columns: ["vacancyId"],
    },
  ],
});
