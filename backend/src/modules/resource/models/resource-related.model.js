import { EntitySchema } from 'typeorm';

export const ResourceRelated = new EntitySchema({
	name: 'ResourceRelated',
	tableName: 'resource_related',
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
		relatedResourceId: {
			name: 'related_resource_id',
			type: 'uuid',
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
		relatedResource: {
			type: 'many-to-one',
			target: 'Resource',
			joinColumn: {
				name: 'related_resource_id',
				referencedColumnName: 'id',
			},
			onDelete: 'CASCADE',
		},
	},
	uniques: [
		{
			name: 'UQ_resource_related_pair',
			columns: ['resourceId', 'relatedResourceId'],
		},
	],
	indices: [
		{
			name: 'IDX_resource_related_resource_id',
			columns: ['resourceId'],
		},
		{
			name: 'IDX_resource_related_related_resource_id',
			columns: ['relatedResourceId'],
		},
	],
});
