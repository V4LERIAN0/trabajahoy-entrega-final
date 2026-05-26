import { EntitySchema } from "typeorm";

export const JobCategory = new EntitySchema({
  name: "JobCategory",
  tableName: "job_categories",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    slug: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: true,
    },
    parentId: {
      name: "parent_id",
      type: "uuid",
      nullable: true,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      name: "updated_at",
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    parent: {
      type: "many-to-one",
      target: "JobCategory",
      joinColumn: {
        name: "parent_id",
        referencedColumnName: "id",
      },
      onDelete: "SET NULL",
    },
    children: {
      type: "one-to-many",
      target: "JobCategory",
      inverseSide: "parent",
    },
    vacancies: {
      type: "one-to-many",
      target: "Vacancy",
      inverseSide: "category",
    },
  },
  indices: [
    {
      name: "IDX_job_categories_slug",
      columns: ["slug"],
    },
    {
      name: "IDX_job_categories_parent_id",
      columns: ["parentId"],
    },
  ],
  uniques: [
    {
      name: "UQ_job_categories_slug",
      columns: ["slug"],
    },
  ],
});
