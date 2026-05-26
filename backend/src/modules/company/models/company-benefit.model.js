import { EntitySchema } from 'typeorm';

export const CompanyBenefit = new EntitySchema({
  name: 'CompanyBenefit',
  tableName: 'company_benefits',
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
    name: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    icon: {
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
    company: {
      type: 'many-to-one',
      target: 'Company',
      joinColumn: {
        name: 'company_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_company_benefits_company_id',
      columns: ['companyId'],
    },
  ],
});
