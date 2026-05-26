import { EntitySchema } from "typeorm";

export const CandidateCompanyFollow = new EntitySchema({
  name: "CandidateCompanyFollow",
  tableName: "candidate_company_follows",
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
    companyId: {
      name: "company_id",
      type: "uuid",
      nullable: false,
    },
    followedAt: {
      name: "followed_at",
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
    company: {
      type: "many-to-one",
      target: "Company",
      joinColumn: {
        name: "company_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_ccf_user_id",
      columns: ["userId"],
    },
    {
      name: "IDX_ccf_company_id",
      columns: ["companyId"],
    },
  ],
  uniques: [
    {
      name: "UQ_ccf_user_company",
      columns: ["userId", "companyId"],
    },
  ],
});
