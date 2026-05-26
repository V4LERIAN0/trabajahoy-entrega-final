import { ForumService } from './forum.service.js';
import { parsePagination } from '../../common/utils/paginator.js';

const forumService = new ForumService();

export class ForumController {
	async getCategories(req, res, next) {
		try {
			const pagination = parsePagination(req);
			const result = await forumService.getCategories(pagination);

			res.status(200).json({
				data: result.data || result,
				...(result.total && {
					pagination: {
						total: result.total,
						page: result.page,
						limit: result.limit,
						totalPages: result.totalPages,
					},
				}),
			});
		} catch (error) {
			next(error);
		}
	}

	async getCategoryById(req, res, next) {
		try {
			const { id } = req.params;
			const category = await forumService.getCategoryById(id);

			res.status(200).json({
				data: category,
			});
		} catch (error) {
			next(error);
		}
	}

	async createCategory(req, res, next) {
		try {
			const category = await forumService.createCategory(req.body);

			res.status(201).json({
				data: category,
				message: 'Category created successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async updateCategory(req, res, next) {
		try {
			const { id } = req.params;
			const category = await forumService.updateCategory(id, req.body);

			res.status(200).json({
				data: category,
				message: 'Category updated successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async deleteCategory(req, res, next) {
		try {
			const { id } = req.params;
			await forumService.deleteCategory(id);

			res.status(200).json({
				message: 'Category deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async getThreads(req, res, next) {
		try {
			const { categoryId, status, search } = req.query;
			const pagination = parsePagination(req);
			const result = await forumService.getThreads({ categoryId, status, search }, pagination);

			res.status(200).json({
				data: result.data || result,
				...(result.total && {
					pagination: {
						total: result.total,
						page: result.page,
						limit: result.limit,
						totalPages: result.totalPages,
					},
				}),
			});
		} catch (error) {
			next(error);
		}
	}

	async getThreadById(req, res, next) {
		try {
			const { id } = req.params;
			const thread = await forumService.getThreadById(id);

			res.status(200).json({
				data: thread,
			});
		} catch (error) {
			next(error);
		}
	}

	async createThread(req, res, next) {
		try {
			const userId = req.user.id;
			const thread = await forumService.createThread(userId, req.body);

			res.status(201).json({
				data: thread,
				message: 'Thread created successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async updateThread(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const userRoles = req.user.roles || [];
			const thread = await forumService.updateThread(id, userId, userRoles, req.body);

			res.status(200).json({
				data: thread,
				message: 'Thread updated successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async deleteThread(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const userRoles = req.user.roles || [];

			await forumService.deleteThread(id, userId, userRoles);

			res.status(200).json({
				message: 'Thread deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async getPostsByThreadId(req, res, next) {
		try {
			const { id } = req.params;
			const pagination = parsePagination(req);
			const result = await forumService.getPostsByThreadId(id, pagination);

			res.status(200).json({
				data: result.data || result,
				...(result.total && {
					pagination: {
						total: result.total,
						page: result.page,
						limit: result.limit,
						totalPages: result.totalPages,
					},
				}),
			});
		} catch (error) {
			next(error);
		}
	}

	async getPostById(req, res, next) {
		try {
			const { id } = req.params;
			const post = await forumService.getPostById(id);

			res.status(200).json({
				data: post,
			});
		} catch (error) {
			next(error);
		}
	}

	async addPost(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const userRoles = req.user.roles || [];
			const post = await forumService.addPost(id, userId, userRoles, req.body);

			res.status(201).json({
				data: post,
				message: 'Post created successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async updatePost(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const userRoles = req.user.roles || [];
			const post = await forumService.updatePost(id, userId, userRoles, req.body);

			res.status(200).json({
				data: post,
				message: 'Post updated successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async deletePost(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const userRoles = req.user.roles || [];

			await forumService.deletePost(id, userId, userRoles);

			res.status(200).json({
				message: 'Post deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async reportPost(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const report = await forumService.reportPost(id, userId, req.body);

			res.status(201).json({
				data: report,
				message: 'Post reported successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async reportThread(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const report = await forumService.reportThread(id, userId, req.body);

			res.status(201).json({
				data: report,
				message: 'Thread reported successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async getReports(req, res, next) {
		try {
			const { status } = req.query;
			const pagination = parsePagination(req);
			const result = await forumService.getReports({ status }, pagination);

			res.status(200).json({
				data: result.data || result,
				...(result.total && {
					pagination: {
						total: result.total,
						page: result.page,
						limit: result.limit,
						totalPages: result.totalPages,
					},
				}),
			});
		} catch (error) {
			next(error);
		}
	}

	async getReportById(req, res, next) {
		try {
			const { id } = req.params;
			const report = await forumService.getReportById(id);

			res.status(200).json({
				data: report,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateReport(req, res, next) {
		try {
			const { id } = req.params;
			const report = await forumService.updateReport(id, req.body);

			res.status(200).json({
				data: report,
				message: 'Report updated successfully',
			});
		} catch (error) {
			next(error);
		}
	}
}
