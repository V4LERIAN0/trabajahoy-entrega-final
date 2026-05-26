import { EntitySchema } from 'typeorm';

export const ForumCategory = new EntitySchema({
	name: 'ForumCategory',
	tableName: 'forum_categories',
	columns: {
		id: {
			type: 'uuid',
			primary: true,
			generated: 'uuid',
		},
		name: {
			type: 'varchar',
			length: 100,
			nullable: false,
		},
		slug: {
			type: 'varchar',
			length: 100,
			nullable: false,
			unique: true,
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
		sortOrder: {
			name: 'sort_order',
			type: 'integer',
			nullable: false,
			default: 0,
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
		threads: {
			type: 'one-to-many',
			target: 'ForumThread',
			inverseSide: 'category',
		},
	},
	indices: [
		{
			name: 'IDX_forum_categories_slug',
			columns: ['slug'],
			unique: true,
		},
	],
});
