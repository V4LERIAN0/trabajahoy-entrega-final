import { EntitySchema } from 'typeorm';

export const Company = new EntitySchema({
  name: 'Company',
  tableName: 'companies',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    ownerId: {
      name: 'owner_id',
      type: 'uuid',
      nullable: false,
    },
    name: {
      type: 'varchar',
      length: 200,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    website: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    industry: {
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    size: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
    logoUrl: {
      name: 'logo_url',
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    coverUrl: {
      name: 'cover_url',
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    phone: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
    isVerified: {
      name: 'is_verified',
      type: 'boolean',
      nullable: false,
      default: false,
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
    owner: {
      type: 'many-to-one',
      target: 'Profile',
      joinColumn: {
        name: 'owner_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    locations: {
      type: 'one-to-many',
      target: 'CompanyLocation',
      inverseSide: 'company',
    },
    benefits: {
      type: 'one-to-many',
      target: 'CompanyBenefit',
      inverseSide: 'company',
    },
    members: {
      type: 'one-to-many',
      target: 'CompanyMember',
      inverseSide: 'company',
    },
    verificationSubmissions: {
      type: 'one-to-many',
      target: 'CompanyVerificationSubmission',
      inverseSide: 'company',
    },
  },
  indices: [
    {
      name: 'IDX_companies_owner_id',
      columns: ['ownerId'],
    },
    {
      name: 'IDX_companies_is_verified',
      columns: ['isVerified'],
    },
    {
      name: 'IDX_companies_industry',
      columns: ['industry'],
    },
  ],
  uniques: [
    {
      name: 'UQ_companies_name',
      columns: ['name'],
    },
  ],
});
