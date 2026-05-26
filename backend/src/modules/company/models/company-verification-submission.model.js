import { EntitySchema } from 'typeorm';

export const CompanyVerificationSubmission = new EntitySchema({
  name: 'CompanyVerificationSubmission',
  tableName: 'company_verification_submissions',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    companyId: {
      name: 'company_id',
      type: 'uuid',
      nullable: false,
    },
    status: {
      type: 'simple-enum',
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      nullable: false,
    },
    submittedAt: {
      name: 'submitted_at',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
    reviewedAt: {
      name: 'reviewed_at',
      type: 'timestamp',
      nullable: true,
    },
    reviewedBy: {
      name: 'reviewed_by',
      type: 'uuid',
      nullable: true,
    },
    notes: {
      type: 'text',
      nullable: true,
    },
  },
  relations: {
    company: {
      type: 'many-to-one',
      target: 'Company',
      joinColumn: {
        name: 'company_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    reviewer: {
      type: 'many-to-one',
      target: 'Profile',
      joinColumn: {
        name: 'reviewed_by',
        referencedColumnName: 'id',
      },
      onDelete: 'SET NULL',
    },
    documents: {
      type: 'one-to-many',
      target: 'CompanyVerificationDocument',
      inverseSide: 'submission',
    },
  },
  indices: [
    {
      name: 'IDX_cvs_company_id',
      columns: ['companyId'],
    },
    {
      name: 'IDX_cvs_status',
      columns: ['status'],
    },
  ],
});
