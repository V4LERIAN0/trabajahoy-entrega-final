import { EntitySchema } from 'typeorm';

export const ReviewHelpfulness = new EntitySchema({
  name: 'ReviewHelpfulness',
  tableName: 'review_helpfulness',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    reviewId: {
      name: 'review_id',
      type: 'uuid',
      nullable: false,
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: false,
    },
    isHelpful: {
      name: 'is_helpful',
      type: 'boolean',
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
    review: {
      type: 'many-to-one',
      target: 'CompanyReview',
      joinColumn: {
        name: 'review_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    user: {
      type: 'many-to-one',
      target: 'Profile',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_review_helpfulness_review_id',
      columns: ['reviewId'],
    },
    {
      name: 'IDX_review_helpfulness_user_id',
      columns: ['userId'],
    },
  ],
});