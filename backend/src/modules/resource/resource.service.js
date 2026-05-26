import { ResourceRepository } from './resource.repository.js';
import { logger } from '../../common/utils/logger.js';

const ALLOWED_RESOURCE_STATUS_TRANSITIONS = {
	draft: ['published'],
	published: ['draft'],
};

export class ResourceService {
	constructor() {
		this.resourceRepository = new ResourceRepository();
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

	async generateUniqueSlug(baseValue, lookupFn, excludeId = null, maxLength = 300, fallbackSlug = 'resource') {
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

	getPublishedAtFromInput(status, publishedAt) {
		if (status !== 'published') {
			return null;
		}

		if (publishedAt) {
			return new Date(publishedAt);
		}

		return new Date();
	}

	getRequestedStatus(data = {}) {
		return data.status ?? data.state;
	}

	ensureValidStatusTransition(currentStatus, nextStatus) {
		if (!nextStatus || currentStatus === nextStatus) {
			return;
		}

		const allowedTransitions = ALLOWED_RESOURCE_STATUS_TRANSITIONS[currentStatus] || [];
		if (!allowedTransitions.includes(nextStatus)) {
			throw new Error(`Invalid resource status transition from ${currentStatus} to ${nextStatus}`);
		}
	}

	async getCategories(pagination = {}) {
		return await this.resourceRepository.findAllCategories(pagination);
	}

	async getCategoryById(id) {
		const category = await this.resourceRepository.findCategoryById(id, ['parent', 'children']);
		if (!category) {
			throw new Error('Resource category not found');
		}
		return category;
	}

	async createCategory(data) {
		if (data.parentId) {
			const parent = await this.resourceRepository.findCategoryById(data.parentId);
			if (!parent) {
				throw new Error('Parent category not found');
			}
		}

		const slug = await this.generateUniqueSlug(data.name, (candidateSlug, excludeId) =>
			this.resourceRepository.findCategoryBySlug(candidateSlug, excludeId),
			null,
			100,
			'category',
		);

		return await this.resourceRepository.createCategory({
			...data,
			slug,
		});
	}

	async updateCategory(id, data) {
		const category = await this.resourceRepository.findCategoryById(id);
		if (!category) {
			throw new Error('Resource category not found');
		}

		if (data.parentId) {
			if (data.parentId === id) {
				throw new Error('Category cannot be parent of itself');
			}

			const parent = await this.resourceRepository.findCategoryById(data.parentId);
			if (!parent) {
				throw new Error('Parent category not found');
			}
		}

		const updateData = { ...data };
		if (data.name) {
			updateData.slug = await this.generateUniqueSlug(
				data.name,
				(candidateSlug, excludeId) => this.resourceRepository.findCategoryBySlug(candidateSlug, excludeId),
				id,
				100,
				'category',
			);
		}

		return await this.resourceRepository.updateCategory(id, updateData);
	}

	async deleteCategory(id) {
		const category = await this.resourceRepository.findCategoryById(id);
		if (!category) {
			throw new Error('Resource category not found');
		}

		return await this.resourceRepository.deleteCategory(id);
	}

	async getResources(filters = {}, pagination = {}, userRoles = []) {
		const isElevated = this.hasElevatedRole(userRoles);
		return await this.resourceRepository.findResources({
			...filters,
			...pagination,
			onlyPublished: !isElevated,
		});
	}

	async getResourceById(id, userRoles = []) {
		const resource = await this.resourceRepository.findResourceById(id, ['category', 'author']);
		if (!resource) {
			throw new Error('Resource not found');
		}

		const isElevated = this.hasElevatedRole(userRoles);
		if (!isElevated && resource.status !== 'published') {
			throw new Error('Resource not found');
		}

		const updatedResource = await this.resourceRepository.incrementResourceViews(id);
		const ratingSummary = await this.resourceRepository.getResourceRatingSummary(id);

		return {
			...updatedResource,
			ratingSummary,
		};
	}

	async createResource(authorId, data) {
		if (data.categoryId) {
			const category = await this.resourceRepository.findCategoryById(data.categoryId);
			if (!category) {
				throw new Error('Resource category not found');
			}
		}

		const status = this.getRequestedStatus(data) || 'draft';
		const slug = await this.generateUniqueSlug(data.title, (candidateSlug, excludeId) =>
			this.resourceRepository.findResourceBySlug(candidateSlug, excludeId),
			null,
			300,
			'resource',
		);

		const resource = await this.resourceRepository.createResource({
			categoryId: data.categoryId ?? null,
			authorId,
			title: data.title,
			slug,
			content: data.content,
			summary: data.summary ?? null,
			coverUrl: data.coverUrl ?? null,
			type: data.type || 'article',
			status,
			publishedAt: this.getPublishedAtFromInput(status, data.publishedAt),
			viewsCount: 0,
		});

		logger.info(`Resource created: ${resource.id}`, { authorId });
		return await this.resourceRepository.findResourceById(resource.id, ['category', 'author']);
	}

	async updateResource(id, data) {
		const resource = await this.resourceRepository.findResourceById(id);
		if (!resource) {
			throw new Error('Resource not found');
		}

		if (data.categoryId) {
			const category = await this.resourceRepository.findCategoryById(data.categoryId);
			if (!category) {
				throw new Error('Resource category not found');
			}
		}

		const updateData = { ...data };
		const requestedStatus = this.getRequestedStatus(data);

		if (Object.prototype.hasOwnProperty.call(data, 'state')) {
			delete updateData.state;
		}

		if (data.title) {
			updateData.slug = await this.generateUniqueSlug(
				data.title,
				(candidateSlug, excludeId) => this.resourceRepository.findResourceBySlug(candidateSlug, excludeId),
				id,
				300,
				'resource',
			);
		}

		if (requestedStatus !== undefined) {
			this.ensureValidStatusTransition(resource.status, requestedStatus);
			updateData.status = requestedStatus;
		}

		if (
			Object.prototype.hasOwnProperty.call(data, 'status')
			|| Object.prototype.hasOwnProperty.call(data, 'state')
			|| Object.prototype.hasOwnProperty.call(data, 'publishedAt')
		) {
			const statusToApply = updateData.status || resource.status;
			updateData.publishedAt = this.getPublishedAtFromInput(statusToApply, data.publishedAt ?? resource.publishedAt);
		}

		return await this.resourceRepository.updateResource(id, updateData);
	}

	async deleteResource(id) {
		const resource = await this.resourceRepository.findResourceById(id);
		if (!resource) {
			throw new Error('Resource not found');
		}

		return await this.resourceRepository.deleteResource(id);
	}

	async rateResource(resourceId, userId, data) {
		const resource = await this.resourceRepository.findResourceById(resourceId);
		if (!resource) {
			throw new Error('Resource not found');
		}

		if (resource.status !== 'published') {
			throw new Error('Resource not found');
		}

		const rating = await this.resourceRepository.upsertRating(resourceId, userId, data.rating);
		const ratingSummary = await this.resourceRepository.getResourceRatingSummary(resourceId);

		return {
			rating,
			summary: ratingSummary,
		};
	}

	async getResourceRatings(resourceId, pagination = {}, userRoles = []) {
		const resource = await this.resourceRepository.findResourceById(resourceId);
		if (!resource) {
			throw new Error('Resource not found');
		}

		const isElevated = this.hasElevatedRole(userRoles);
		if (!isElevated && resource.status !== 'published') {
			throw new Error('Resource not found');
		}

		const result = await this.resourceRepository.findRatingsByResourceId(resourceId, pagination);
		const summary = await this.resourceRepository.getResourceRatingSummary(resourceId);

		if (Array.isArray(result)) {
			return {
				data: result,
				summary,
			};
		}

		return {
			...result,
			summary,
		};
	}

	async addRelatedResource(resourceId, relatedResourceId) {
		if (resourceId === relatedResourceId) {
			throw new Error('A resource cannot be related to itself');
		}

		const resource = await this.resourceRepository.findResourceById(resourceId);
		if (!resource) {
			throw new Error('Resource not found');
		}

		const relatedResource = await this.resourceRepository.findResourceById(relatedResourceId);
		if (!relatedResource) {
			throw new Error('Related resource not found');
		}

		const existingRelation = await this.resourceRepository.findRelatedByPair(resourceId, relatedResourceId);
		if (existingRelation) {
			throw new Error('Related resource pair already exists');
		}

		return await this.resourceRepository.createRelatedResource(resourceId, relatedResourceId);
	}

	async getRelatedResources(resourceId, pagination = {}, userRoles = []) {
		const resource = await this.resourceRepository.findResourceById(resourceId);
		if (!resource) {
			throw new Error('Resource not found');
		}

		const isElevated = this.hasElevatedRole(userRoles);
		if (!isElevated && resource.status !== 'published') {
			throw new Error('Resource not found');
		}

		const result = await this.resourceRepository.findRelatedByResourceId(resourceId, pagination);

		const filterRelated = (items) => items.filter((item) => isElevated || item.relatedResource?.status === 'published');

		if (Array.isArray(result)) {
			return filterRelated(result);
		}

		return {
			...result,
			data: filterRelated(result.data),
		};
	}

	async deleteRelatedResource(relatedId) {
		const related = await this.resourceRepository.findRelatedById(relatedId);
		if (!related) {
			throw new Error('Related resource link not found');
		}

		return await this.resourceRepository.deleteRelatedResource(relatedId);
	}
}
