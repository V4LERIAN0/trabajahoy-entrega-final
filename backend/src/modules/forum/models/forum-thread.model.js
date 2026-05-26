import { EntitySchema } from 'typeorm';

const threadStatusValues = ['open', 'closed', 'pinned', 'resolved'];

export const ForumThread = new EntitySchema({
	name: 'ForumThread',
	tableName: 'forum_threads',
	columns: {
		id: {
			type: 'uuid',
			primary: true,
			generated: 'uuid',
		},
		categoryId: {
			name: 'category_id',
			type: 'uuid',
			nullable: false,
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
		status: {
			type: 'enum',
			enum: threadStatusValues,
			enumName: 'forum_thread_status_enum',
			nullable: false,
			default: 'open',
		},
		viewsCount: {
			name: 'views_count',
			type: 'integer',
			nullable: false,
			default: 0,
		},
		repliesCount: {
			name: 'replies_count',
			type: 'integer',
			nullable: false,
			default: 0,
		},
		lastActivityAt: {
			name: 'last_activity_at',
			type: 'timestamp',
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
		category: {
			type: 'many-to-one',
			target: 'ForumCategory',
			joinColumn: {
				name: 'category_id',
				referencedColumnName: 'id',
			},
			onDelete: 'CASCADE',
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
		posts: {
			type: 'one-to-many',
			target: 'ForumPost',
			inverseSide: 'thread',
		},
		reports: {
			type: 'one-to-many',
			target: 'ForumReport',
			inverseSide: 'thread',
		},
	},
	indices: [
		{
			name: 'IDX_forum_threads_category_id',
			columns: ['categoryId'],
		},
		{
			name: 'IDX_forum_threads_author_id',
			columns: ['authorId'],
		},
		{
			name: 'IDX_forum_threads_slug',
			columns: ['slug'],
			unique: true,
		},
		{
			name: 'IDX_forum_threads_status',
			columns: ['status'],
		},
	],
});
