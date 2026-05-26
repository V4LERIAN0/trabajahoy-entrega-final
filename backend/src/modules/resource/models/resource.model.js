import { EntitySchema } from 'typeorm';

const resourceTypeValues = ['article', 'guide', 'video', 'podcast', 'template'];
const resourceStatusValues = ['draft', 'published'];

export const Resource = new EntitySchema({
	name: 'Resource',
	tableName: 'resources',
	columns: {
		id: {
			type: 'uuid',
			primary: true,
			generated: 'uuid',
		},
		categoryId: {
			name: 'category_id',
			type: 'uuid',
			nullable: true,
		},
		authorId: {
			name: 'author_id',
			type: 'uuid',
			nullable: false,
		},
		title: {
			type: 'varchar',
			length: 300,
			nullable: false,
		},
		slug: {
			type: 'varchar',
			length: 300,
			nullable: false,
			unique: true,
		},
		content: {
			type: 'text',
			nullable: false,
		},
		summary: {
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
		type: {
			type: 'enum',
			enum: resourceTypeValues,
			enumName: 'resource_type_enum',
			nullable: false,
			default: 'article',
		},
		status: {
			type: 'enum',
			enum: resourceStatusValues,
			enumName: 'resource_status_enum',
			nullable: false,
			default: 'draft',
		},
		publishedAt: {
			name: 'published_at',
			type: 'timestamp',
			nullable: true,
		},
		viewsCount: {
			name: 'views_count',
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
		category: {
			type: 'many-to-one',
			target: 'ResourceCategory',
			joinColumn: {
				name: 'category_id',
				referencedColumnName: 'id',
			},
			onDelete: 'SET NULL',
		},
		author: {
			type: 'many-to-one',
			target: 'Profile',
			joinColumn: {
				name: 'author_id',
				referencedColumnName: 'id',
			},
			onDelete: 'CASCADE',
		},
		ratings: {
			type: 'one-to-many',
			target: 'ResourceRating',
			inverseSide: 'resource',
		},
		relatedResources: {
			type: 'one-to-many',
			target: 'ResourceRelated',
			inverseSide: 'resource',
		},
	},
	indices: [
		{
			name: 'IDX_resources_category_id',
			columns: ['categoryId'],
		},
		{
			name: 'IDX_resources_author_id',
			columns: ['authorId'],
		},
		{
			name: 'IDX_resources_slug',
			columns: ['slug'],
		},
		{
			name: 'IDX_resources_status',
			columns: ['status'],
		},
		{
			name: 'IDX_resources_type',
			columns: ['type'],
		},
	],
});
