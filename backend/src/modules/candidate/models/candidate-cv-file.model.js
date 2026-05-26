import { EntitySchema } from 'typeorm';

export const CandidateCvFile = new EntitySchema({
  name: 'CandidateCvFile',
  tableName: 'candidate_cv_files',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    candidateId: {
      name: 'candidate_id',
      type: 'uuid',
      nullable: false,
    },
    fileUrl: {
      name: 'file_url',
      type: 'varchar',
      length: 500,
      nullable: false,
    },
    fileName: {
      name: 'file_name',
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    fileSize: {
      name: 'file_size',
      type: 'int',
      nullable: true,
    },
    fileType: {
      name: 'file_type',
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    uploadedAt: {
      name: 'uploaded_at',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    candidate: {
      type: 'many-to-one',
      target: 'CandidateProfile',
      joinColumn: {
        name: 'candidate_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_candidate_cv_files_candidate_id',
      columns: ['candidateId'],
    },
  ],
});
