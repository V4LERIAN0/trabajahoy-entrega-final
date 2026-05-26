import { EntitySchema } from 'typeorm';

export const ReviewReport = new EntitySchema({
  name: "ReviewReport",
  tableName: "review_reports",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    reviewId: {
      name: "review_id",
      type: "uuid",
      nullable: false,
    },
    userId: {
      name: "user_id",
      type: "uuid",
      nullable: false,
    },
    reason: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: true,
    },
    status: {
      type: "enum",
      enumName: "report_status_enum",
      enum: ["pending", "resolved", "dismissed"],
      nullable: false,
      default: "pending",
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    review: {
      type: "many-to-one",
      target: "CompanyReview",
      joinColumn: {
        name: "review_id",
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
      name: "IDX_review_reports_review_id",
      columns: ["reviewId"],
    },
    {
      name: "IDX_review_reports_user_id",
      columns: ["userId"],
    },
    {
      name: "IDX_review_reports_status",
      columns: ["status"],
    },
  ],
});