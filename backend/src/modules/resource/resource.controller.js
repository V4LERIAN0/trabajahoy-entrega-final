import { ResourceService } from './resource.service.js';
import { parsePagination } from '../../common/utils/paginator.js';

const resourceService = new ResourceService();

export class ResourceController {
	async getCategories(req, res, next) {
		try {
			const pagination = parsePagination(req);
			const result = await resourceService.getCategories(pagination);

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
			const category = await resourceService.getCategoryById(id);

			res.status(200).json({
				data: category,
			});
		} catch (error) {
			next(error);
		}
	}

	async createCategory(req, res, next) {
		try {
			const category = await resourceService.createCategory(req.body);

			res.status(201).json({
				data: category,
				message: 'Resource category created successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async updateCategory(req, res, next) {
		try {
			const { id } = req.params;
			const category = await resourceService.updateCategory(id, req.body);

			res.status(200).json({
				data: category,
				message: 'Resource category updated successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async deleteCategory(req, res, next) {
		try {
			const { id } = req.params;
			await resourceService.deleteCategory(id);

			res.status(200).json({
				message: 'Resource category deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async getResources(req, res, next) {
		try {
			const { categoryId, type, status, search } = req.query;
			const pagination = parsePagination(req);
			const userRoles = req.user?.roles || [];

			const result = await resourceService.getResources({ categoryId, type, status, search }, pagination, userRoles);

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

	async getResourceById(req, res, next) {
		try {
			const { id } = req.params;
			const userRoles = req.user?.roles || [];
			const resource = await resourceService.getResourceById(id, userRoles);

			res.status(200).json({
				data: resource,
			});
		} catch (error) {
			next(error);
		}
	}

	async createResource(req, res, next) {
		try {
			const authorId = req.user.id;
			const resource = await resourceService.createResource(authorId, req.body);

			res.status(201).json({
				data: resource,
				message: 'Resource created successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async updateResource(req, res, next) {
		try {
			const { id } = req.params;
			const resource = await resourceService.updateResource(id, req.body);

			res.status(200).json({
				data: resource,
				message: 'Resource updated successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async deleteResource(req, res, next) {
		try {
			const { id } = req.params;
			await resourceService.deleteResource(id);

			res.status(200).json({
				message: 'Resource deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async rateResource(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user.id;

			const result = await resourceService.rateResource(id, userId, req.body);
			res.status(200).json({
				data: result,
				message: 'Resource rated successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async getResourceRatings(req, res, next) {
		try {
			const { id } = req.params;
			const pagination = parsePagination(req);
			const userRoles = req.user?.roles || [];
			const result = await resourceService.getResourceRatings(id, pagination, userRoles);
			const ratings = result.data || result;

			res.status(200).json({
				data: {
					ratings,
					summary: result.summary,
				},
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

	async addRelatedResource(req, res, next) {
		try {
			const { id } = req.params;
			const { relatedResourceId } = req.body;
			const related = await resourceService.addRelatedResource(id, relatedResourceId);

			res.status(201).json({
				data: related,
				message: 'Related resource added successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	async getRelatedResources(req, res, next) {
		try {
			const { id } = req.params;
			const pagination = parsePagination(req);
			const userRoles = req.user?.roles || [];

			const result = await resourceService.getRelatedResources(id, pagination, userRoles);

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

	async deleteRelatedResource(req, res, next) {
		try {
			const { id } = req.params;
			await resourceService.deleteRelatedResource(id);

			res.status(200).json({
				message: 'Related resource deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}
}
