import { EntitySchema } from "typeorm";

export const SavedJob = new EntitySchema({
  name: "SavedJob",
  tableName: "saved_jobs",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    userId: {
      name: "user_id",
      type: "uuid",
      nullable: false,
    },
    vacancyId: {
      name: "vacancy_id",
      type: "uuid",
      nullable: false,
    },
    savedAt: {
      name: "saved_at",
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
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
      name: "IDX_saved_jobs_user_id",
      columns: ["userId"],
    },
    {
      name: "IDX_saved_jobs_vacancy_id",
      columns: ["vacancyId"],
    },
  ],
  uniques: [
    {
      name: "UQ_saved_jobs_user_vacancy",
      columns: ["userId", "vacancyId"],
    },
  ],
});
