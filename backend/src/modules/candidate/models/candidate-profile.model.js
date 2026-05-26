import { EntitySchema } from 'typeorm';

export const CandidateProfile = new EntitySchema({
  name: 'CandidateProfile',
  tableName: 'candidate_profiles',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    userId: {
      type: 'uuid',
      nullable: false,
      unique: true,
      name: 'user_id',
    },
    bio: {
      type: 'text',
      nullable: true,
    },
    headline: {
      type: 'varchar',
      length: 200,
      nullable: true,
    },
    website: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    location: {
      type: 'varchar',
      length: 200,
      nullable: true,
    },
    availability: {
      type: 'varchar',
      length: 50,
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
    user: {
      type: 'one-to-one',
      target: 'Profile',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    experiences: {
      type: 'one-to-many',
      target: 'CandidateExperience',
      inverseSide: 'candidate',
    },
    education: {
      type: 'one-to-many',
      target: 'CandidateEducation',
      inverseSide: 'candidate',
    },
    skills: {
      type: 'one-to-many',
      target: 'CandidateSkill',
      inverseSide: 'candidate',
    },
    languages: {
      type: 'one-to-many',
      target: 'CandidateLanguage',
      inverseSide: 'candidate',
    },
    cvs: {
      type: 'one-to-many',
      target: 'CandidateCvFile',
      inverseSide: 'candidate',
    },
    interests: {
      type: 'one-to-many',
      target: 'CandidateInterest',
      inverseSide: 'candidate',
    },
  },
  indices: [
    {
      name: 'IDX_candidate_profiles_user_id',
      columns: ['userId'],
      unique: true,
    },
  ],
});
