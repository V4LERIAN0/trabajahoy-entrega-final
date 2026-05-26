import { EntitySchema } from 'typeorm';

export const JobAlert = new EntitySchema({
  name: "JobAlert",
  tableName: "job_alerts",
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
    keywords: {
      type: "text",
      array: true,
      nullable: true,
    },
    location: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    type: {
      type: "enum",
      enumName: "vacancy_type_enum",
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      nullable: true,
    },
    modality: {
      type: "enum",
      enumName: "vacancy_modality_enum",
      enum: ["remote", "hybrid", "onsite"],
      nullable: true,
    },
    level: {
      type: "enum",
      enumName: "vacancy_level_enum",
      enum: ["junior", "mid", "senior", "lead", "manager", "director"],
      nullable: true,
    },
    frequency: {
      type: "enum",
      enumName: "alert_frequency_enum",
      enum: ["daily", "weekly"],
      nullable: false,
      default: "daily",
    },
    isActive: {
      name: "is_active",
      type: "boolean",
      nullable: false,
      default: true,
    },
    lastSentAt: {
      name: "last_sent_at",
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
    user: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_job_alerts_user_id",
      columns: ["userId"],
    },
    {
      name: "IDX_job_alerts_is_active",
      columns: ["isActive"],
    },
    {
      name: "IDX_job_alerts_frequency",
      columns: ["frequency"],
    },
  ],
});