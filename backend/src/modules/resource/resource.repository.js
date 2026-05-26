import { AppDataSource } from '../../database/data-source.js';
import { Resource } from './models/resource.model.js';
import { ResourceCategory } from './models/resource-category.model.js';
import { ResourceRating } from './models/resource-rating.model.js';
import { ResourceRelated } from './models/resource-related.model.js';

export class ResourceRepository {
	constructor() {
		this.resourceRepository = AppDataSource.getRepository(Resource);
		this.resourceCategoryRepository = AppDataSource.getRepository(ResourceCategory);
		this.resourceRatingRepository = AppDataSource.getRepository(ResourceRating);
		this.resourceRelatedRepository = AppDataSource.getRepository(ResourceRelated);
	}

	async findCategoryById(id, relations = ['parent']) {
		return await this.resourceCategoryRepository.findOne({
			where: { id },
			relations,
		});
	}

	async findCategoryBySlug(slug, excludeId = null) {
		const queryBuilder = this.resourceCategoryRepository
			.createQueryBuilder('category')
			.where('category.slug = :slug', { slug });

		if (excludeId) {
			queryBuilder.andWhere('category.id != :excludeId', { excludeId });
		}

		return await queryBuilder.getOne();
	}

	async findAllCategories({ page, limit } = {}) {
		const queryBuilder = this.resourceCategoryRepository
			.createQueryBuilder('category')
			.leftJoinAndSelect('category.parent', 'parent')
			.orderBy('category.createdAt', 'DESC');

		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
			const [data, total] = await queryBuilder.getManyAndCount();
			return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
		}

		return await queryBuilder.getMany();
	}

	async createCategory(data) {
		const category = this.resourceCategoryRepository.create(data);
		return await this.resourceCategoryRepository.save(category);
	}

	async updateCategory(id, data) {
		await this.resourceCategoryRepository.update(id, data);
		return await this.findCategoryById(id);
	}

	async deleteCategory(id) {
		return await this.resourceCategoryRepository.delete(id);
	}

	async findResourceById(id, relations = ['category', 'author']) {
		return await this.resourceRepository.findOne({
			where: { id },
			relations,
		});
	}

	async findResourceBySlug(slug, excludeId = null) {
		const queryBuilder = this.resourceRepository
			.createQueryBuilder('resource')
			.where('resource.slug = :slug', { slug });

		if (excludeId) {
			queryBuilder.andWhere('resource.id != :excludeId', { excludeId });
		}

		return await queryBuilder.getOne();
	}

	async findResources({ categoryId, type, status, search, page, limit, onlyPublished } = {}) {
		const queryBuilder = this.resourceRepository
			.createQueryBuilder('resource')
			.leftJoinAndSelect('resource.category', 'category')
			.leftJoinAndSelect('resource.author', 'author')
			.orderBy('resource.publishedAt', 'DESC', 'NULLS LAST')
			.addOrderBy('resource.createdAt', 'DESC');

		if (categoryId) {
			queryBuilder.andWhere('resource.categoryId = :categoryId', { categoryId });
		}

		if (type) {
			queryBuilder.andWhere('resource.type = :type', { type });
		}

		if (status) {
			queryBuilder.andWhere('resource.status = :status', { status });
		}

		if (onlyPublished) {
			queryBuilder.andWhere('resource.status = :publishedStatus', { publishedStatus: 'published' });
		}

		if (search) {
			queryBuilder.andWhere('(resource.title ILIKE :search OR resource.summary ILIKE :search)', {
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

	async createResource(data) {
		const resource = this.resourceRepository.create(data);
		return await this.resourceRepository.save(resource);
	}

	async updateResource(id, data) {
		await this.resourceRepository.update(id, data);
		return await this.findResourceById(id, ['category', 'author']);
	}

	async deleteResource(id) {
		return await this.resourceRepository.delete(id);
	}

	async incrementResourceViews(id) {
		await this.resourceRepository.increment({ id }, 'viewsCount', 1);
		return await this.findResourceById(id, ['category', 'author']);
	}

	async findRatingByUser(resourceId, userId) {
		return await this.resourceRatingRepository.findOne({
			where: {
				resourceId,
				userId,
			},
		});
	}

	async upsertRating(resourceId, userId, rating) {
		await this.resourceRatingRepository.upsert({ resourceId, userId, rating }, ['resourceId', 'userId']);
		return await this.findRatingByUser(resourceId, userId);
	}

	async findRatingsByResourceId(resourceId, { page, limit } = {}) {
		const queryBuilder = this.resourceRatingRepository
			.createQueryBuilder('rating')
			.leftJoinAndSelect('rating.user', 'user')
			.where('rating.resourceId = :resourceId', { resourceId })
			.orderBy('rating.createdAt', 'DESC');

		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
			const [data, total] = await queryBuilder.getManyAndCount();
			return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
		}

		return await queryBuilder.getMany();
	}

	async getResourceRatingSummary(resourceId) {
		const raw = await this.resourceRatingRepository
			.createQueryBuilder('rating')
			.select('COALESCE(AVG(rating.rating), 0)', 'average')
			.addSelect('COUNT(rating.id)', 'count')
			.where('rating.resourceId = :resourceId', { resourceId })
			.getRawOne();

		return {
			average: Number(raw.average),
			count: Number(raw.count),
		};
	}

	async findRelatedById(id) {
		return await this.resourceRelatedRepository.findOne({
			where: { id },
			relations: ['resource', 'relatedResource'],
		});
	}

	async findRelatedByPair(resourceId, relatedResourceId) {
		return await this.resourceRelatedRepository.findOne({
			where: {
				resourceId,
				relatedResourceId,
			},
		});
	}

	async findRelatedByResourceId(resourceId, { page, limit } = {}) {
		const queryBuilder = this.resourceRelatedRepository
			.createQueryBuilder('related')
			.leftJoinAndSelect('related.relatedResource', 'relatedResource')
			.where('related.resourceId = :resourceId', { resourceId })
			.orderBy('related.createdAt', 'DESC');

		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
			const [data, total] = await queryBuilder.getManyAndCount();
			return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
		}

		return await queryBuilder.getMany();
	}

	async createRelatedResource(resourceId, relatedResourceId) {
		const related = this.resourceRelatedRepository.create({
			resourceId,
			relatedResourceId,
		});
		return await this.resourceRelatedRepository.save(related);
	}

	async deleteRelatedResource(id) {
		return await this.resourceRelatedRepository.delete(id);
	}
}
