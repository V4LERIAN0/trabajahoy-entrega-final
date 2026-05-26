import { EntitySchema } from "typeorm";

export const VacancyBenefit = new EntitySchema({
  name: "VacancyBenefit",
  tableName: "vacancy_benefits",
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
    benefitName: {
      name: "benefit_name",
      type: "varchar",
      length: 100,
      nullable: false,
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
      name: "IDX_vacancy_benefits_vacancy_id",
      columns: ["vacancyId"],
    },
  ],
});
