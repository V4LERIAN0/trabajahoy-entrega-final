import { AppDataSource } from '../../database/data-source.js';

export class BaseRepository {
  constructor(entityClass) {
    this.entityClass = entityClass;
    this.repository = AppDataSource.getRepository(entityClass);
  }

  // Core CRUD operations

  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @returns {Object} Created entity
   */
  async create(data) {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  /**
   * Find entity by ID
   * @param {string} id - Entity UUID
   * @param {string[]} relations - Array of relation names to load
   * @returns {Object|null} Entity or null if not found
   */
  async findById(id, relations = []) {
    const options = { where: { id } };
    if (relations.length > 0) {
      options.relations = relations;
    }
    return await this.repository.findOne(options);
  }

  /**
   * Find all entities with optional pagination
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.limit - Items per page
   * @param {string[]} options.relations - Array of relation names to load
   * @param {string} options.orderBy - Field to order by
   * @param {string} options.orderDir - Order direction (ASC/DESC)
   * @returns {Object} Paginated result or array
   */
  async findAll({ page, limit, relations = [], orderBy = 'createdAt', orderDir = 'DESC' } = {}) {
    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (relations.length > 0) {
      relations.forEach((rel) => {
        queryBuilder.leftJoinAndSelect(`entity.${rel}`, rel);
      });
    }

    queryBuilder.orderBy(`entity.${orderBy}`, orderDir);

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const data = await queryBuilder.getMany();
    return data;
  }

  /**
   * Update an entity by ID
   * @param {string} id - Entity UUID
   * @param {Object} data - Update data
   * @returns {Object|null} Updated entity or null if not found
   */
  async update(id, data) {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  /**
   * Delete an entity by ID
   * @param {string} id - Entity UUID
   * @returns {Object|null} Deleted entity or null if not found
   */
  async delete(id) {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }
    await this.repository.delete(id);
    return entity;
  }

  // Advanced query methods

  /**
   * Find one entity by conditions
   * @param {Object} where - Where conditions
   * @param {string[]} relations - Array of relation names to load
   * @returns {Object|null} Entity or null if not found
   */
  async findOne(where, relations = []) {
    const options = { where };
    if (relations.length > 0) {
      options.relations = relations;
    }
    return await this.repository.findOne(options);
  }

  /**
   * Find entities by conditions with optional pagination
   * @param {Object} where - Where conditions
   * @param {Object} options - Query options
   * @returns {Object|Array} Paginated result or array of entities
   */
  async find(where, options = {}) {
    const { relations = [], orderBy = 'createdAt', orderDir = 'DESC', page, limit } = options;

    const queryBuilder = this.repository.createQueryBuilder('entity');

    // Apply where conditions
    if (where && Object.keys(where).length > 0) {
      Object.keys(where).forEach((key, index) => {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: where[key] });
      });
    }

    if (relations.length > 0) {
      relations.forEach((rel) => {
        queryBuilder.leftJoinAndSelect(`entity.${rel}`, rel);
      });
    }

    queryBuilder.orderBy(`entity.${orderBy}`, orderDir);

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    return await queryBuilder.getMany();
  }

  /**
   * Check if an entity exists by ID
   * @param {string} id - Entity UUID
   * @returns {boolean} True if entity exists
   */
  async exists(id) {
    return await this.repository.existsBy({ id });
  }

  /**
   * Count entities by conditions
   * @param {Object} where - Where conditions
   * @returns {number} Count of matching entities
   */
  async count(where = {}) {
    return await this.repository.countBy(where);
  }

  // Transaction support

  /**
   * Create entity within a transaction
   * @param {Object} data - Entity data
   * @param {QueryRunner} queryRunner - TypeORM query runner
   * @returns {Object} Created entity
   */
  async createInTransaction(data, queryRunner) {
    const entity = this.repository.create(data);
    return await queryRunner.manager.save(entity);
  }

  /**
   * Update entity within a transaction
   * @param {string} id - Entity UUID
   * @param {Object} data - Update data
   * @param {QueryRunner} queryRunner - TypeORM query runner
   * @returns {Object|null} Updated entity or null
   */
  async updateInTransaction(id, data, queryRunner) {
    await queryRunner.manager.update(this.entityClass, id, data);
    return await queryRunner.manager.findOne(this.entityClass, { where: { id } });
  }

  /**
   * Delete entity within a transaction
   * @param {string} id - Entity UUID
   * @param {QueryRunner} queryRunner - TypeORM query runner
   * @returns {Object|null} Deleted entity or null
   */
  async deleteInTransaction(id, queryRunner) {
    const entity = await queryRunner.manager.findOne(this.entityClass, { where: { id } });
    if (!entity) {
      return null;
    }
    await queryRunner.manager.delete(this.entityClass, id);
    return entity;
  }

  // Query builder access

  /**
   * Create a query builder for complex queries
   * @param {string} alias - Query builder alias
   * @returns {QueryBuilder} TypeORM query builder
   */
  createQueryBuilder(alias = 'entity') {
    return this.repository.createQueryBuilder(alias);
  }

  /**
   * Get the underlying TypeORM repository
   * @returns {Repository} TypeORM repository
   */
  getRepository() {
    return this.repository;
  }
}
