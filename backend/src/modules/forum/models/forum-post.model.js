import { EntitySchema } from 'typeorm';

export const ForumPost = new EntitySchema({
	name: 'ForumPost',
	tableName: 'forum_posts',
	columns: {
		id: {
			type: 'uuid',
			primary: true,
			generated: 'uuid',
		},
		threadId: {
			name: 'thread_id',
			type: 'uuid',
			nullable: false,
		},
		authorId: {
			name: 'author_id',
			type: 'uuid',
			nullable: false,
		},
		content: {
			type: 'text',
			nullable: false,
		},
		isSolution: {
			name: 'is_solution',
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
		thread: {
			type: 'many-to-one',
			target: 'ForumThread',
			joinColumn: {
				name: 'thread_id',
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
		reports: {
			type: 'one-to-many',
			target: 'ForumReport',
			inverseSide: 'post',
		},
	},
	indices: [
		{
			name: 'IDX_forum_posts_thread_id',
			columns: ['threadId'],
		},
		{
			name: 'IDX_forum_posts_author_id',
			columns: ['authorId'],
		},
		{
			name: 'IDX_forum_posts_is_solution',
			columns: ['isSolution'],
		},
	],
});
