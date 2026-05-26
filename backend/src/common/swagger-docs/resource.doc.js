/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Resources and articles management (careers, guides, tutorials)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateResourceCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: Career Guides
 *         description:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: Comprehensive guides for career development
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *     ResourceCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateResource:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         title:
 *           type: string
 *           maxLength: 300
 *           example: How to Ace Your First Technical Interview
 *         content:
 *           type: string
 *           maxLength: 50000
 *           example: A comprehensive guide covering...
 *         summary:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: Learn the best practices for technical interviews
 *         coverUrl:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: https://example.com/image.jpg
 *         type:
 *           type: string
 *           enum: [article, guide, video, podcast, template]
 *           example: article
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           example: published
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2024-01-15T10:00:00Z
 *     Resource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         authorId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         summary:
 *           type: string
 *           nullable: true
 *         coverUrl:
 *           type: string
 *           nullable: true
 *         type:
 *           type: string
 *           enum: [article, guide, video, podcast, template]
 *         status:
 *           type: string
 *           enum: [draft, published]
 *         viewsCount:
 *           type: integer
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RateResource:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *     ResourceRating:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         resourceId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         rating:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ResourceRatingSummary:
 *       type: object
 *       properties:
 *         averageRating:
 *           type: number
 *           format: float
 *           example: 4.5
 *         totalRatings:
 *           type: integer
 *           example: 120
 *     CreateRelatedResource:
 *       type: object
 *       required:
 *         - relatedResourceId
 *       properties:
 *         relatedResourceId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174001
 *     RelatedResource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         resourceId:
 *           type: string
 *           format: uuid
 *         relatedResourceId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Error message here
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/* ==================== CATEGORIES ==================== */

/**
 * @swagger
 * /api/resource/categories:
 *   get:
 *     summary: List all resource categories
 *     description: Retrieves a paginated list of all resource categories.
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ResourceCategory'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *   post:
 *     summary: Create a resource category
 *     description: Creates a new resource category. Requires admin or moderator role.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResourceCategory'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ResourceCategory'
 *                 message:
 *                   type: string
 *                   example: Resource category created successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/resource/categories/{id}:
 *   get:
 *     summary: Get resource category by ID
 *     description: Retrieves a single resource category by its ID.
 *     tags: [Resource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ResourceCategory'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Category not found
 *   patch:
 *     summary: Update resource category
 *     description: Updates a resource category. All fields are optional. Requires admin or moderator role.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResourceCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ResourceCategory'
 *                 message:
 *                   type: string
 *                   example: Resource category updated successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete resource category
 *     description: Deletes a resource category. Requires admin or moderator role.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Resource category deleted successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Category not found
 */

/* ==================== RESOURCES ==================== */

/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: List all resources
 *     description: Retrieves a paginated list of resources with optional filters. Public endpoint (optional auth for draft access).
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [article, guide, video, podcast, template]
 *         description: Filter by resource type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Filter by status (requires admin/moderator)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search resources by title or summary
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Resources retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resource'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *   post:
 *     summary: Create a resource
 *     description: Creates a new resource (article, guide, video, etc.). Requires admin or moderator role.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResource'
 *     responses:
 *       201:
 *         description: Resource created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Resource'
 *                 message:
 *                   type: string
 *                   example: Resource created successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/resource/{id}:
 *   get:
 *     summary: Get resource by ID
 *     description: Retrieves a single resource with details. Public endpoint (optional auth for draft access).
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Resource'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Resource not found
 *   patch:
 *     summary: Update resource
 *     description: Updates a resource. All fields are optional. Requires admin or moderator role.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResource'
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Resource'
 *                 message:
 *                   type: string
 *                   example: Resource updated successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       404:
 *         description: Resource not found
 *   delete:
 *     summary: Delete resource
 *     description: Deletes a resource. Requires admin or moderator role.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Resource deleted successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Resource not found
 */

/* ==================== RATINGS ==================== */

/**
 * @swagger
 * /api/resource/{id}/ratings:
 *   post:
 *     summary: Rate a resource
 *     description: Rates a resource from 1 to 5 stars. Requires authentication. Users can update their own rating.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RateResource'
 *     responses:
 *       200:
 *         description: Resource rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ResourceRating'
 *                 message:
 *                   type: string
 *                   example: Resource rated successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Resource not found
 *   get:
 *     summary: Get resource ratings
 *     description: Retrieves ratings for a resource with summary statistics. Public endpoint (optional auth).
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resource ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     ratings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ResourceRating'
 *                     summary:
 *                       $ref: '#/components/schemas/ResourceRatingSummary'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Resource not found
 */

/* ==================== RELATED RESOURCES ==================== */

/**
 * @swagger
 * /api/resource/{id}/related:
 *   post:
 *     summary: Add related resource
 *     description: Links a related resource to a parent resource. Requires admin or moderator role.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRelatedResource'
 *     responses:
 *       201:
 *         description: Related resource added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/RelatedResource'
 *                 message:
 *                   type: string
 *                   example: Related resource added successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       404:
 *         description: Resource not found
 *   get:
 *     summary: List related resources
 *     description: Retrieves related resources for a resource. Public endpoint (optional auth).
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resource ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Related resources retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RelatedResource'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Resource not found
 */

/**
 * @swagger
 * /api/resource/related/{id}:
 *   delete:
 *     summary: Delete related resource
 *     description: Removes a related resource link. Requires admin or moderator role.
 *     tags: [Resource]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Related resource link ID
 *     responses:
 *       200:
 *         description: Related resource deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Related resource deleted successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Related resource not found
 */
