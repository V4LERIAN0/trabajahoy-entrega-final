import { EntitySchema } from 'typeorm';

export const CompanyReview = new EntitySchema({
  name: 'CompanyReview',
  tableName: 'company_reviews',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: false,
    },
    companyId: {
      name: 'company_id',
      type: 'uuid',
      nullable: false,
    },
    overallRating: {
      name: 'overall_rating',
      type: 'int',
      nullable: false,
    },
    workLifeBalance: {
      name: 'work_life_balance',
      type: 'int',
      nullable: true,
    },
    compensation: {
      type: 'int',
      nullable: true,
    },
    culture: {
      type: 'int',
      nullable: true,
    },
    managementRating: {
      name: 'management_rating',
      type: 'int',
      nullable: true,
    },
    careerOpportunities: {
      name: 'career_opportunities',
      type: 'int',
      nullable: true,
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    pros: {
      type: 'text',
      nullable: true,
    },
    cons: {
      type: 'text',
      nullable: true,
    },
    reviewDate: {
      name: 'review_date',
      type: 'date',
      nullable: false,
    },
    isAnonymous: {
      name: 'is_anonymous',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    status: {
      type: 'enum',
      enumName: 'review_status_enum',
      enum: ['pending', 'approved', 'rejected'],
      nullable: false,
      default: 'pending',
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
      type: 'many-to-one',
      target: 'Profile',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    company: {
      type: 'many-to-one',
      target: 'Company',
      joinColumn: {
        name: 'company_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    helpfulnessVotes: {
      type: 'one-to-many',
      target: 'ReviewHelpfulness',
      inverseSide: 'review',
    },
    reports: {
      type: 'one-to-many',
      target: 'ReviewReport',
      inverseSide: 'review',
    },
  },
  indices: [
    {
      name: 'IDX_company_reviews_user_id',
      columns: ['userId'],
    },
    {
      name: 'IDX_company_reviews_company_id',
      columns: ['companyId'],
    },
    {
      name: 'IDX_company_reviews_status',
      columns: ['status'],
    },
    {
      name: 'IDX_company_reviews_review_date',
      columns: ['reviewDate'],
    },
  ],
});