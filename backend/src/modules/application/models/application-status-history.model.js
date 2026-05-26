import { EntitySchema } from "typeorm";

const applicationStatusEnum = [
  "pending",
  "reviewed",
  "interview",
  "accepted",
  "rejected",
];

export const ApplicationStatusHistory = new EntitySchema({
  name: "ApplicationStatusHistory",
  tableName: "application_status_history",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    applicationId: {
      name: "application_id",
      type: "uuid",
      nullable: false,
    },
    fromStatus: {
      name: "from_status",
      type: "simple-enum",
      enum: applicationStatusEnum,
      nullable: true,
    },
    toStatus: {
      name: "to_status",
      type: "simple-enum",
      enum: applicationStatusEnum,
      nullable: false,
    },
    changedBy: {
      name: "changed_by",
      type: "uuid",
      nullable: true,
    },
    changedAt: {
      name: "changed_at",
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    notes: {
      type: "text",
      nullable: true,
    },
  },
  relations: {
    application: {
      type: "many-to-one",
      target: "JobApplication",
      joinColumn: {
        name: "application_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
    changedByUser: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "changed_by",
        referencedColumnName: "id",
      },
      onDelete: "SET NULL",
    },
  },
  indices: [
    {
      name: "IDX_ash_application_id",
      columns: ["applicationId"],
    },
  ],
});
