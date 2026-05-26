import { EntitySchema } from 'typeorm';

export const CandidateInterest = new EntitySchema({
  name: 'CandidateInterest',
  tableName: 'candidate_interests',
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
    tagName: {
      name: 'tag_name',
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    createdAt: {
      name: 'created_at',
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
      name: 'IDX_candidate_interests_candidate_id',
      columns: ['candidateId'],
    },
    {
      name: 'IDX_candidate_interests_tag_name',
      columns: ['tagName'],
    },
  ],
});
