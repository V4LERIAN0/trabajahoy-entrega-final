import { EntitySchema } from 'typeorm';

export const Notification = new EntitySchema({
  name: 'Notification',
  tableName: 'notifications',
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
    type: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    message: {
      type: 'text',
      nullable: false,
    },
    isRead: {
      name: 'is_read',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    link: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    metadata: {
      type: 'jsonb',
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
      name: 'IDX_notifications_user_id',
      columns: ['userId'],
    },
    {
      name: 'IDX_notifications_is_read',
      columns: ['isRead'],
    },
    {
      name: 'IDX_notifications_created_at',
      columns: ['createdAt'],
    },
  ],
});