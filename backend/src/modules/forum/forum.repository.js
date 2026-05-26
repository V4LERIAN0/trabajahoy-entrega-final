import { AppDataSource } from '../../database/data-source.js';
import { ForumCategory } from './models/forum-category.model.js';
import { ForumThread } from './models/forum-thread.model.js';
import { ForumPost } from './models/forum-post.model.js';
import { ForumReport } from './models/forum-report.model.js';

export class ForumRepository {
	constructor() {
		this.categoryRepository = AppDataSource.getRepository(ForumCategory);
		this.threadRepository = AppDataSource.getRepository(ForumThread);
		this.postRepository = AppDataSource.getRepository(ForumPost);
		this.reportRepository = AppDataSource.getRepository(ForumReport);
	}

	async findCategoryById(id) {
		return await this.categoryRepository.findOne({ where: { id } });
	}

	async findCategoryBySlug(slug, excludeId = null) {
		const queryBuilder = this.categoryRepository
			.createQueryBuilder('category')
			.where('category.slug = :slug', { slug });

		if (excludeId) {
			queryBuilder.andWhere('category.id != :excludeId', { excludeId });
		}

		return await queryBuilder.getOne();
	}

	async findAllCategories({ page, limit } = {}) {
		const queryBuilder = this.categoryRepository
			.createQueryBuilder('category')
			.orderBy('category.sortOrder', 'ASC')
			.addOrderBy('category.createdAt', 'ASC');

		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
			const [data, total] = await queryBuilder.getManyAndCount();
			return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
		}

		return await queryBuilder.getMany();
	}

	async createCategory(data) {
		const category = this.categoryRepository.create(data);
		return await this.categoryRepository.save(category);
	}

	async updateCategory(id, data) {
		await this.categoryRepository.update(id, data);
		return await this.findCategoryById(id);
	}

	async deleteCategory(id) {
		return await this.categoryRepository.delete(id);
	}

	async findThreadById(id, relations = ['category', 'author']) {
		return await this.threadRepository.findOne({ where: { id }, relations });
	}

	async findThreadBySlug(slug, excludeId = null) {
		const queryBuilder = this.threadRepository
			.createQueryBuilder('thread')
			.where('thread.slug = :slug', { slug });

		if (excludeId) {
			queryBuilder.andWhere('thread.id != :excludeId', { excludeId });
		}

		return await queryBuilder.getOne();
	}

	async findThreads({ categoryId, status, search, page, limit } = {}) {
		const queryBuilder = this.threadRepository
			.createQueryBuilder('thread')
			.leftJoinAndSelect('thread.category', 'category')
			.leftJoinAndSelect('thread.author', 'author')
			.orderBy('thread.lastActivityAt', 'DESC', 'NULLS LAST')
			.addOrderBy('thread.createdAt', 'DESC');

		if (categoryId) {
			queryBuilder.andWhere('thread.categoryId = :categoryId', { categoryId });
		}

		if (status) {
			queryBuilder.andWhere('thread.status = :status', { status });
		}

		if (search) {
			queryBuilder.andWhere('(thread.title ILIKE :search OR thread.content ILIKE :search)', {
				search: `%${search}%`,
			});
		}

		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
			const [data, total] = await queryBuilder.getManyAndCount();
			return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
		}

		return await queryBuilder.getMany();
	}

	async createThread(data) {
		const thread = this.threadRepository.create(data);
		return await this.threadRepository.save(thread);
	}

	async updateThread(id, data) {
		await this.threadRepository.update(id, data);
		return await this.findThreadById(id);
	}

	async deleteThread(id) {
		return await this.threadRepository.delete(id);
	}

	async incrementThreadViews(id) {
		await this.threadRepository.increment({ id }, 'viewsCount', 1);
		return await this.findThreadById(id);
	}

	async incrementThreadReplies(id) {
		await this.threadRepository.increment({ id }, 'repliesCount', 1);
	}

	async decrementThreadReplies(id) {
		await this.threadRepository
			.createQueryBuilder()
			.update(ForumThread)
			.set({
				repliesCount: () => '"repliesCount" - 1',
			})
			.where('id = :id', { id })
			.andWhere('"repliesCount" > 0')
			.execute();
	}

	async touchThreadActivity(id, date = new Date()) {
		await this.threadRepository.update(id, { lastActivityAt: date });
	}

	async findPostById(id, relations = ['thread', 'author']) {
		return await this.postRepository.findOne({ where: { id }, relations });
	}

	async findPostsByThreadId(threadId, { page, limit } = {}) {
		const queryBuilder = this.postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.author', 'author')
			.where('post.threadId = :threadId', { threadId })
			.orderBy('post.isSolution', 'DESC')
			.addOrderBy('post.createdAt', 'ASC');

		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
			const [data, total] = await queryBuilder.getManyAndCount();
			return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
		}

		return await queryBuilder.getMany();
	}

	async createPost(data) {
		const post = this.postRepository.create(data);
		return await this.postRepository.save(post);
	}

	async updatePost(id, data) {
		await this.postRepository.update(id, data);
		return await this.findPostById(id);
	}

	async deletePost(id) {
		return await this.postRepository.delete(id);
	}

	async clearThreadSolutions(threadId, excludePostId) {
		await this.postRepository.update(
			{ threadId, isSolution: true },
			{ isSolution: false },
		);

		if (excludePostId) {
			await this.postRepository.update(excludePostId, { isSolution: true });
		}
	}

	async findReportById(id, relations = ['post', 'thread', 'user']) {
		return await this.reportRepository.findOne({ where: { id }, relations });
	}

	async findReports({ status, page, limit } = {}) {
		const queryBuilder = this.reportRepository
			.createQueryBuilder('report')
			.leftJoinAndSelect('report.post', 'post')
			.leftJoinAndSelect('report.thread', 'thread')
			.leftJoinAndSelect('report.user', 'user')
			.orderBy('report.createdAt', 'DESC');

		if (status) {
			queryBuilder.andWhere('report.status = :status', { status });
		}

		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
			const [data, total] = await queryBuilder.getManyAndCount();
			return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
		}

		return await queryBuilder.getMany();
	}

	async createReport(data) {
		const report = this.reportRepository.create(data);
		return await this.reportRepository.save(report);
	}

	async updateReport(id, data) {
		await this.reportRepository.update(id, data);
		return await this.findReportById(id);
	}

	async findPendingReportByUserAndTarget(userId, { postId = null, threadId = null } = {}) {
		return await this.reportRepository.findOne({
			where: {
				userId,
				postId,
				threadId,
				status: 'pending',
			},
		});
	}
}
