import { EntitySchema } from "typeorm";

export const Vacancy = new EntitySchema({
  name: "Vacancy",
  tableName: "vacancies",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    companyId: {
      name: "company_id",
      type: "uuid",
      nullable: false,
    },
    categoryId: {
      name: "category_id",
      type: "uuid",
      nullable: true,
    },
    title: {
      type: "varchar",
      length: 200,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: false,
    },
    requirements: {
      type: "text",
      nullable: false,
    },
    benefitsText: {
      name: "benefits_text",
      type: "text",
      nullable: true,
    },
    salaryMin: {
      name: "salary_min",
      type: "decimal",
      precision: 12,
      scale: 2,
      nullable: true,
    },
    salaryMax: {
      name: "salary_max",
      type: "decimal",
      precision: 12,
      scale: 2,
      nullable: true,
    },
    currency: {
      type: "varchar",
      length: 10,
      nullable: true,
      default: "USD",
    },
    type: {
      type: "simple-enum",
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      nullable: false,
      default: "full-time",
    },
    modality: {
      type: "simple-enum",
      enum: ["remote", "hybrid", "onsite"],
      nullable: false,
      default: "onsite",
    },
    level: {
      type: "simple-enum",
      enum: ["junior", "mid", "senior", "lead", "manager", "director"],
      nullable: false,
      default: "mid",
    },
    status: {
      type: "simple-enum",
      enum: ["draft", "published", "closed", "archived"],
      nullable: false,
      default: "draft",
    },
    country: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    city: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    locationText: {
      name: "location_text",
      type: "varchar",
      length: 200,
      nullable: true,
    },
    applicationDeadline: {
      name: "application_deadline",
      type: "date",
      nullable: true,
    },
    openings: {
      type: "integer",
      nullable: false,
      default: 1,
    },
    publishedAt: {
      name: "published_at",
      type: "timestamp",
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
    company: {
      type: "many-to-one",
      target: "Company",
      joinColumn: {
        name: "company_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
    category: {
      type: "many-to-one",
      target: "JobCategory",
      joinColumn: {
        name: "category_id",
        referencedColumnName: "id",
      },
      onDelete: "SET NULL",
    },
    skills: {
      type: "one-to-many",
      target: "VacancySkill",
      inverseSide: "vacancy",
    },
    benefits: {
      type: "one-to-many",
      target: "VacancyBenefit",
      inverseSide: "vacancy",
    },
  },
  indices: [
    {
      name: "IDX_vacancies_company_id",
      columns: ["companyId"],
    },
    {
      name: "IDX_vacancies_category_id",
      columns: ["categoryId"],
    },
    {
      name: "IDX_vacancies_status",
      columns: ["status"],
    },
    {
      name: "IDX_vacancies_type",
      columns: ["type"],
    },
    {
      name: "IDX_vacancies_modality",
      columns: ["modality"],
    },
    {
      name: "IDX_vacancies_level",
      columns: ["level"],
    },
    {
      name: "IDX_vacancies_country",
      columns: ["country"],
    },
    {
      name: "IDX_vacancies_city",
      columns: ["city"],
    },
  ],
});
