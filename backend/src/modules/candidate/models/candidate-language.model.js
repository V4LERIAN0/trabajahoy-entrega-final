import { EntitySchema } from 'typeorm';

export const CandidateLanguage = new EntitySchema({
  name: 'CandidateLanguage',
  tableName: 'candidate_languages',
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
    languageName: {
      name: 'language_name',
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    proficiency: {
      type: 'simple-enum',
      enum: ['basic', 'intermediate', 'advanced', 'native'],
      default: 'intermediate',
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
      name: 'IDX_candidate_languages_candidate_id',
      columns: ['candidateId'],
    },
  ],
});
