import { EntitySchema } from 'typeorm';

const reportStatusValues = ['pending', 'resolved', 'dismissed'];

export const ForumReport = new EntitySchema({
	name: 'ForumReport',
	tableName: 'forum_reports',
	columns: {
		id: {
			type: 'uuid',
			primary: true,
			generated: 'uuid',
		},
		postId: {
			name: 'post_id',
			type: 'uuid',
			nullable: true,
		},
		threadId: {
			name: 'thread_id',
			type: 'uuid',
			nullable: true,
		},
		userId: {
			name: 'user_id',
			type: 'uuid',
			nullable: false,
		},
		reason: {
			type: 'varchar',
			length: 200,
			nullable: false,
		},
		description: {
			type: 'text',
			nullable: true,
		},
		status: {
			type: 'enum',
			enum: reportStatusValues,
			enumName: 'report_status_enum',
			nullable: false,
			default: 'pending',
		},
		createdAt: {
			name: 'created_at',
			type: 'timestamp',
			nullable: false,
			default: () => 'CURRENT_TIMESTAMP',
		},
	},
	relations: {
		post: {
			type: 'many-to-one',
			target: 'ForumPost',
			joinColumn: {
				name: 'post_id',
				referencedColumnName: 'id',
			},
			onDelete: 'CASCADE',
		},
		thread: {
			type: 'many-to-one',
			target: 'ForumThread',
			joinColumn: {
				name: 'thread_id',
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
	indices: [
		{
			name: 'IDX_forum_reports_post_id',
			columns: ['postId'],
		},
		{
			name: 'IDX_forum_reports_thread_id',
			columns: ['threadId'],
		},
		{
			name: 'IDX_forum_reports_user_id',
			columns: ['userId'],
		},
		{
			name: 'IDX_forum_reports_status',
			columns: ['status'],
		},
	],
});
