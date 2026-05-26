import { EntitySchema } from 'typeorm';

export const CompanyVerificationDocument = new EntitySchema({
  name: 'CompanyVerificationDocument',
  tableName: 'company_verification_documents',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    submissionId: {
      name: 'submission_id',
      type: 'uuid',
      nullable: false,
    },
    documentType: {
      name: 'document_type',
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    fileUrl: {
      name: 'file_url',
      type: 'varchar',
      length: 500,
      nullable: false,
    },
    status: {
      type: 'simple-enum',
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      nullable: false,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    submission: {
      type: 'many-to-one',
      target: 'CompanyVerificationSubmission',
      joinColumn: {
        name: 'submission_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_cvd_submission_id',
      columns: ['submissionId'],
    },
  ],
});
