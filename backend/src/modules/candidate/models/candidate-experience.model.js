import { EntitySchema } from 'typeorm';

export const CandidateExperience = new EntitySchema({
  name: 'CandidateExperience',
  tableName: 'candidate_experiences',
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
    companyName: {
      name: 'company_name',
      type: 'varchar',
      length: 200,
      nullable: false,
    },
    role: {
      type: 'varchar',
      length: 200,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    startDate: {
      name: 'start_date',
      type: 'date',
      nullable: false,
    },
    endDate: {
      name: 'end_date',
      type: 'date',
      nullable: true,
    },
    isCurrent: {
      name: 'is_current',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    location: {
      type: 'varchar',
      length: 200,
      nullable: true,
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
      name: 'IDX_candidate_experiences_candidate_id',
      columns: ['candidateId'],
    },
    {
      name: 'IDX_candidate_experiences_is_current',
      columns: ['isCurrent'],
    },
  ],
});
