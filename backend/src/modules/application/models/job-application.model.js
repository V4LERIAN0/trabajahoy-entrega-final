import { EntitySchema } from "typeorm";

const applicationStatusEnum = [
  "pending",
  "reviewed",
  "interview",
  "accepted",
  "rejected",
];

export const JobApplication = new EntitySchema({
  name: "JobApplication",
  tableName: "job_applications",
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
    status: {
      type: "simple-enum",
      enum: applicationStatusEnum,
      nullable: false,
      default: "pending",
    },
    coverLetter: {
      name: "cover_letter",
      type: "text",
      nullable: true,
    },
    cvFileUrl: {
      name: "cv_file_url",
      type: "varchar",
      length: 500,
      nullable: true,
    },
    resumeUrl: {
      name: "resume_url",
      type: "varchar",
      length: 500,
      nullable: true,
    },
    interviewScheduledAt: {
      name: "interview_scheduled_at",
      type: "timestamp",
      nullable: true,
    },
    interviewLocation: {
      name: "interview_location",
      type: "varchar",
      length: 500,
      nullable: true,
    },
    interviewNotes: {
      name: "interview_notes",
      type: "text",
      nullable: true,
    },
    appliedAt: {
      name: "applied_at",
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
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
    vacancy: {
      type: "many-to-one",
      target: "Vacancy",
      joinColumn: {
        name: "vacancy_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
    history: {
      type: "one-to-many",
      target: "ApplicationStatusHistory",
      inverseSide: "application",
    },
    comments: {
      type: "one-to-many",
      target: "ApplicationComment",
      inverseSide: "application",
    },
  },
  indices: [
    {
      name: "IDX_job_applications_user_id",
      columns: ["userId"],
    },
    {
      name: "IDX_job_applications_vacancy_id",
      columns: ["vacancyId"],
    },
    {
      name: "IDX_job_applications_status",
      columns: ["status"],
    },
  ],
});
