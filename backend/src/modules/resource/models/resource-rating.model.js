import { EntitySchema } from 'typeorm';

export const ResourceRating = new EntitySchema({
	name: 'ResourceRating',
	tableName: 'resource_ratings',
	columns: {
		id: {
			type: 'uuid',
			primary: true,
			generated: 'uuid',
		},
		resourceId: {
			name: 'resource_id',
			type: 'uuid',
			nullable: false,
		},
		userId: {
			name: 'user_id',
			type: 'uuid',
			nullable: false,
		},
		rating: {
			type: 'integer',
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
		resource: {
			type: 'many-to-one',
			target: 'Resource',
			joinColumn: {
				name: 'resource_id',
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
	uniques: [
		{
			name: 'UQ_resource_ratings_resource_user',
			columns: ['resourceId', 'userId'],
		},
	],
	indices: [
		{
			name: 'IDX_resource_ratings_resource_id',
			columns: ['resourceId'],
		},
		{
			name: 'IDX_resource_ratings_user_id',
			columns: ['userId'],
		},
	],
});
