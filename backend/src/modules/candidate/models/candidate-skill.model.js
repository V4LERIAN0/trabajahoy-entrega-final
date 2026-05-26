import { EntitySchema } from 'typeorm';

export const CandidateSkill = new EntitySchema({
  name: 'CandidateSkill',
  tableName: 'candidate_skills',
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
    skillName: {
      name: 'skill_name',
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    level: {
      type: 'simple-enum',
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate',
      nullable: false,
    },
    yearsOfExperience: {
      name: 'years_of_experience',
      type: 'int',
      nullable: true,
      default: 0,
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
      name: 'IDX_candidate_skills_candidate_id',
      columns: ['candidateId'],
    },
    {
      name: 'IDX_candidate_skills_skill_name',
      columns: ['skillName'],
    },
    {
      name: 'IDX_candidate_skills_level',
      columns: ['level'],
    },
  ],
});
