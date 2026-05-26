import { ForumRepository } from './forum.repository.js';
import { logger } from '../../common/utils/logger.js';

export class ForumService {
	constructor() {
		this.forumRepository = new ForumRepository();
	}

	slugify(value) {
		return value
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.replace(/-{2,}/g, '-');
	}

	async generateUniqueSlug(baseValue, lookupFn, excludeId = null, maxLength = 300, fallbackSlug = 'item') {
		const normalizedMaxLength = Math.max(maxLength, fallbackSlug.length);
		const baseSlug = this.slugify(baseValue) || fallbackSlug;
		const safeBaseSlug = baseSlug.slice(0, normalizedMaxLength);
		let slug = safeBaseSlug;
		let suffix = 1;

		while (await lookupFn(slug, excludeId)) {
			const suffixPart = `-${suffix}`;
			const maxBaseLength = Math.max(0, normalizedMaxLength - suffixPart.length);
			const truncatedBaseSlug = safeBaseSlug.slice(0, maxBaseLength);
			slug = `${truncatedBaseSlug}${suffixPart}`;
			suffix += 1;
		}

		return slug;
	}

	hasElevatedRole(userRoles = []) {
		return userRoles.some((role) => ['admin', 'moderator'].includes(role));
	}

	async getCategories(pagination = {}) {
		return await this.forumRepository.findAllCategories(pagination);
	}

	async getCategoryById(id) {
		const category = await this.forumRepository.findCategoryById(id);
		if (!category) {
			throw new Error('Category not found');
		}
		return category;
	}

	async createCategory(data) {
		const slug = await this.generateUniqueSlug(data.name, (candidateSlug, excludeId) =>
			this.forumRepository.findCategoryBySlug(candidateSlug, excludeId),
			null,
			100,
			'category',
		);

		return await this.forumRepository.createCategory({
			...data,
			slug,
		});
	}

	async updateCategory(id, data) {
		const category = await this.forumRepository.findCategoryById(id);
		if (!category) {
			throw new Error('Category not found');
		}

		const updateData = { ...data };
		if (data.name) {
			updateData.slug = await this.generateUniqueSlug(
				data.name,
				(candidateSlug, excludeId) => this.forumRepository.findCategoryBySlug(candidateSlug, excludeId),
				id,
				100,
				'category',
			);
		}

		return await this.forumRepository.updateCategory(id, updateData);
	}

	async deleteCategory(id) {
		const category = await this.forumRepository.findCategoryById(id);
		if (!category) {
			throw new Error('Category not found');
		}

		return await this.forumRepository.deleteCategory(id);
	}

	async getThreads(filters = {}, pagination = {}) {
		return await this.forumRepository.findThreads({ ...filters, ...pagination });
	}

	async getThreadById(id) {
		const thread = await this.forumRepository.findThreadById(id, ['category', 'author']);
		if (!thread) {
			throw new Error('Thread not found');
		}

		await this.forumRepository.incrementThreadViews(id);
		return await this.forumRepository.findThreadById(id, ['category', 'author']);
	}

	async createThread(userId, data) {
		const category = await this.forumRepository.findCategoryById(data.categoryId);
		if (!category) {
			throw new Error('Category not found');
		}

		const slug = await this.generateUniqueSlug(data.title, (candidateSlug, excludeId) =>
			this.forumRepository.findThreadBySlug(candidateSlug, excludeId),
			null,
			300,
			'thread',
		);

		const thread = await this.forumRepository.createThread({
			categoryId: data.categoryId,
			authorId: userId,
			title: data.title,
			slug,
			content: data.content,
			status: data.status || 'open',
			viewsCount: 0,
			repliesCount: 0,
			lastActivityAt: new Date(),
		});

		logger.info(`Forum thread created: ${thread.id}`, { userId, categoryId: data.categoryId });
		return thread;
	}

	async updateThread(id, userId, userRoles, data) {
		const thread = await this.forumRepository.findThreadById(id);
		if (!thread) {
			throw new Error('Thread not found');
		}

		if (thread.authorId !== userId && !this.hasElevatedRole(userRoles)) {
			throw new Error('You do not have permission to update this thread');
		}

		const updateData = { ...data };

		if (data.categoryId) {
			const category = await this.forumRepository.findCategoryById(data.categoryId);
			if (!category) {
				throw new Error('Category not found');
			}
		}

		if (data.title) {
			updateData.slug = await this.generateUniqueSlug(
				data.title,
				(candidateSlug, excludeId) => this.forumRepository.findThreadBySlug(candidateSlug, excludeId),
				id,
				300,
				'thread',
			);
		}

		return await this.forumRepository.updateThread(id, updateData);
	}

	async deleteThread(id, userId, userRoles) {
		const thread = await this.forumRepository.findThreadById(id);
		if (!thread) {
			throw new Error('Thread not found');
		}

		if (thread.authorId !== userId && !this.hasElevatedRole(userRoles)) {
			throw new Error('You do not have permission to delete this thread');
		}

		return await this.forumRepository.deleteThread(id);
	}

	async getPostsByThreadId(threadId, pagination = {}) {
		const thread = await this.forumRepository.findThreadById(threadId);
		if (!thread) {
			throw new Error('Thread not found');
		}

		return await this.forumRepository.findPostsByThreadId(threadId, pagination);
	}

	async getPostById(id) {
		const post = await this.forumRepository.findPostById(id);
		if (!post) {
			throw new Error('Post not found');
		}
		return post;
	}

	async addPost(threadId, userId, userRoles, data) {
		const thread = await this.forumRepository.findThreadById(threadId);
		if (!thread) {
			throw new Error('Thread not found');
		}

		if (thread.status === 'closed' && !this.hasElevatedRole(userRoles)) {
			throw new Error('Thread is closed');
		}

		const post = await this.forumRepository.createPost({
			threadId,
			authorId: userId,
			content: data.content,
			isSolution: false,
		});

		await this.forumRepository.incrementThreadReplies(threadId);
		await this.forumRepository.touchThreadActivity(threadId);

		logger.info(`Forum post created: ${post.id}`, { userId, threadId });
		return post;
	}

	async updatePost(id, userId, userRoles, data) {
		const post = await this.forumRepository.findPostById(id);
		if (!post) {
			throw new Error('Post not found');
		}

		const hasIsSolutionUpdate = Object.prototype.hasOwnProperty.call(data, 'isSolution');
		const isSolutionOnlyUpdate = hasIsSolutionUpdate && Object.keys(data).every((key) => key === 'isSolution');
		const isElevatedUser = this.hasElevatedRole(userRoles);
		let thread = null;

		if (post.authorId !== userId && !isElevatedUser) {
			if (!isSolutionOnlyUpdate) {
				throw new Error('You do not have permission to update this post');
			}

			thread = await this.forumRepository.findThreadById(post.threadId);
			if (!thread) {
				throw new Error('Thread not found');
			}

			if (thread.authorId !== userId) {
				throw new Error('You do not have permission to update this post');
			}
		}

		const updateData = { ...data };

		if (hasIsSolutionUpdate) {
			thread = thread || (await this.forumRepository.findThreadById(post.threadId));
			if (!thread) {
				throw new Error('Thread not found');
			}

			if (thread.authorId !== userId && !isElevatedUser) {
				throw new Error('You do not have permission to mark this post as solution');
			}

			if (data.isSolution === true) {
				await this.forumRepository.clearThreadSolutions(post.threadId, id);
				updateData.isSolution = true;
			}
		}

		return await this.forumRepository.updatePost(id, updateData);
	}

	async deletePost(id, userId, userRoles) {
		const post = await this.forumRepository.findPostById(id);
		if (!post) {
			throw new Error('Post not found');
		}

		if (post.authorId !== userId && !this.hasElevatedRole(userRoles)) {
			throw new Error('You do not have permission to delete this post');
		}

		await this.forumRepository.deletePost(id);
		await this.forumRepository.decrementThreadReplies(post.threadId);
		return post;
	}

	async reportPost(postId, userId, data) {
		const post = await this.forumRepository.findPostById(postId);
		if (!post) {
			throw new Error('Post not found');
		}

		const existingReport = await this.forumRepository.findPendingReportByUserAndTarget(userId, {
			postId,
		});

		if (existingReport) {
			throw new Error('You already have a pending report for this post');
		}

		return await this.forumRepository.createReport({
			postId,
			threadId: null,
			userId,
			reason: data.reason,
			description: data.description,
			status: 'pending',
		});
	}

	async reportThread(threadId, userId, data) {
		const thread = await this.forumRepository.findThreadById(threadId);
		if (!thread) {
			throw new Error('Thread not found');
		}

		const existingReport = await this.forumRepository.findPendingReportByUserAndTarget(userId, {
			threadId,
		});

		if (existingReport) {
			throw new Error('You already have a pending report for this thread');
		}

		return await this.forumRepository.createReport({
			postId: null,
			threadId,
			userId,
			reason: data.reason,
			description: data.description,
			status: 'pending',
		});
	}

	async getReports(filters = {}, pagination = {}) {
		return await this.forumRepository.findReports({ ...filters, ...pagination });
	}

	async getReportById(id) {
		const report = await this.forumRepository.findReportById(id);
		if (!report) {
			throw new Error('Report not found');
		}
		return report;
	}

	async updateReport(id, data) {
		const report = await this.forumRepository.findReportById(id);
		if (!report) {
			throw new Error('Report not found');
		}

		return await this.forumRepository.updateReport(id, {
			status: data.status,
		});
	}
}
