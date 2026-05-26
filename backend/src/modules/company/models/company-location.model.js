import { EntitySchema } from 'typeorm';

export const CompanyLocation = new EntitySchema({
  name: 'CompanyLocation',
  tableName: 'company_locations',
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
    country: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    city: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    address: {
      type: 'varchar',
      length: 300,
      nullable: true,
    },
    isHeadquarters: {
      name: 'is_headquarters',
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
      name: 'IDX_company_locations_company_id',
      columns: ['companyId'],
    },
  ],
});
