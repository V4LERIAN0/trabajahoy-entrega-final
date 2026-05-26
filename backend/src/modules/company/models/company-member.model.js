import { EntitySchema } from 'typeorm';

export const CompanyMember = new EntitySchema({
  name: 'CompanyMember',
  tableName: 'company_members',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    companyId: {
      name: 'company_id',
      type: 'uuid',
      nullable: false,
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: false,
    },
    role: {
      type: 'simple-enum',
      enum: ['owner', 'company_admin', 'recruiter'],
      default: 'recruiter',
      nullable: false,
    },
    joinedAt: {
      name: 'joined_at',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    company: {
      type: 'many-to-one',
      target: 'Company',
      joinColumn: {
        name: 'company_id',
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
      name: 'IDX_company_members_company_id',
      columns: ['companyId'],
    },
    {
      name: 'IDX_company_members_user_id',
      columns: ['userId'],
    },
  ],
  uniques: [
    {
      name: 'UQ_company_members_company_user',
      columns: ['companyId', 'userId'],
    },
  ],
});
