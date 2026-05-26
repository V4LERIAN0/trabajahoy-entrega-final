import { EntitySchema } from 'typeorm';

export const Role = new EntitySchema({
  name: 'Role',
  tableName: 'roles',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: 50,
      nullable: false,
      unique: true,
    },
    description: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    users: {
      type: 'many-to-many',
      target: 'Profile',
      inverseSide: 'roles',
    },
  },
});
