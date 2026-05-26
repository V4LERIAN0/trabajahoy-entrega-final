import { EntitySchema } from "typeorm";

export const ApplicationComment = new EntitySchema({
  name: "ApplicationComment",
  tableName: "application_comments",
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
    userId: {
      name: "user_id",
      type: "uuid",
      nullable: false,
    },
    content: {
      type: "text",
      nullable: false,
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
    application: {
      type: "many-to-one",
      target: "JobApplication",
      joinColumn: {
        name: "application_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
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
      name: "IDX_ac_application_id",
      columns: ["applicationId"],
    },
    {
      name: "IDX_ac_user_id",
      columns: ["userId"],
    },
  ],
});
