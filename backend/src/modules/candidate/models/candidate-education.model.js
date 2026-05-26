import { EntitySchema } from 'typeorm';

export const CandidateEducation = new EntitySchema({
  name: 'CandidateEducation',
  tableName: 'candidate_education',
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
    institution: {
      type: 'varchar',
      length: 200,
      nullable: false,
    },
    degree: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    fieldOfStudy: {
      name: 'field_of_study',
      type: 'varchar',
      length: 200,
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
    grade: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    description: {
      type: 'text',
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
      name: 'IDX_candidate_education_candidate_id',
      columns: ['candidateId'],
    },
  ],
});
