import { EntitySchema } from 'typeorm';

export const ResourceCategory = new EntitySchema({
	name: 'ResourceCategory',
	tableName: 'resource_categories',
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
		parentId: {
			name: 'parent_id',
			type: 'uuid',
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
		parent: {
			type: 'many-to-one',
			target: 'ResourceCategory',
			joinColumn: {
				name: 'parent_id',
				referencedColumnName: 'id',
			},
			onDelete: 'SET NULL',
		},
		children: {
			type: 'one-to-many',
			target: 'ResourceCategory',
			inverseSide: 'parent',
		},
		resources: {
			type: 'one-to-many',
			target: 'Resource',
			inverseSide: 'category',
		},
	},
	indices: [
		{
			name: 'IDX_resource_categories_slug',
			columns: ['slug'],
		},
		{
			name: 'IDX_resource_categories_parent_id',
			columns: ['parentId'],
		},
	],
});
