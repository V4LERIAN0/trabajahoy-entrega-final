import { EntitySchema } from 'typeorm';

export const UserRole = new EntitySchema({
  name: 'UserRole',
  tableName: 'user_roles',
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
    roleId: {
      name: 'role_id',
      type: 'uuid',
      nullable: false,
    },
    assignedBy: {
      name: 'assigned_by',
      type: 'uuid',
      nullable: true,
    },
    assignedAt: {
      name: 'assigned_at',
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
    role: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: {
        name: 'role_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    assignedByProfile: {
      type: 'many-to-one',
      target: 'Profile',
      joinColumn: {
        name: 'assigned_by',
        referencedColumnName: 'id',
      },
      onDelete: 'SET NULL',
    },
  },
  uniques: [
    {
      name: 'UQ_user_roles_user_role',
      columns: ['userId', 'roleId'],
    },
  ],
  indices: [
    {
      name: 'IDX_user_roles_user_id',
      columns: ['userId'],
    },
    {
      name: 'IDX_user_roles_role_id',
      columns: ['roleId'],
    },
  ],
});
