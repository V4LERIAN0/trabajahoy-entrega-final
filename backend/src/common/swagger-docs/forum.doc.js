/**
 * @swagger
 * tags:
 *   name: Forum
 *   description: Community forum with categories, threads, posts, and moderation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateForumCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: General Discussion
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: A place for general discussions about jobs and careers
 *         icon:
 *           type: string
 *           maxLength: 50
 *           example: comment
 *         sortOrder:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *     ForumCategory:
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
 *         icon:
 *           type: string
 *           nullable: true
 *         sortOrder:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateForumThread:
 *       type: object
 *       required:
 *         - categoryId
 *         - title
 *         - content
 *       properties:
 *         categoryId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         title:
 *           type: string
 *           maxLength: 300
 *           example: How to prepare for a technical interview?
 *         content:
 *           type: string
 *           maxLength: 20000
 *           example: I have an upcoming interview and would like to know...
 *     ForumThread:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *         authorId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         status:
 *           type: string
 *           enum: [open, closed, pinned, resolved]
 *         isPinned:
 *           type: boolean
 *         isResolved:
 *           type: boolean
 *         viewsCount:
 *           type: integer
 *         postsCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateForumPost:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           maxLength: 10000
 *           example: Great question! Here are my tips...
 *     ForumPost:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         threadId:
 *           type: string
 *           format: uuid
 *         authorId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         isSolution:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateForumReport:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           maxLength: 200
 *           example: Inappropriate content
 *         description:
 *           type: string
 *           maxLength: 2000
 *           example: This post contains offensive language
 *     ForumReport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         reporterId:
 *           type: string
 *           format: uuid
 *         postId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         threadId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         reason:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [pending, resolved, dismissed]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
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
 * /api/forum/categories:
 *   get:
 *     summary: List all forum categories
 *     description: Retrieves a paginated list of all forum categories.
 *     tags: [Forum]
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
 *                     $ref: '#/components/schemas/ForumCategory'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *   post:
 *     summary: Create a forum category
 *     description: Creates a new forum category. Requires admin or moderator role.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateForumCategory'
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
 *                   $ref: '#/components/schemas/ForumCategory'
 *                 message:
 *                   type: string
 *                   example: Category created successfully
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
 * /api/forum/categories/{id}:
 *   get:
 *     summary: Get forum category by ID
 *     description: Retrieves a single forum category by its ID.
 *     tags: [Forum]
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
 *                   $ref: '#/components/schemas/ForumCategory'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Category not found
 *   patch:
 *     summary: Update forum category
 *     description: Updates a forum category. All fields are optional. Requires admin or moderator role.
 *     tags: [Forum]
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
 *             $ref: '#/components/schemas/CreateForumCategory'
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
 *                   $ref: '#/components/schemas/ForumCategory'
 *                 message:
 *                   type: string
 *                   example: Category updated successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete forum category
 *     description: Deletes a forum category. Requires admin or moderator role.
 *     tags: [Forum]
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
 *                   example: Category deleted successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Category not found
 */

/* ==================== THREADS ==================== */

/**
 * @swagger
 * /api/forum/threads:
 *   get:
 *     summary: List all forum threads
 *     description: Retrieves a paginated list of forum threads with optional filters.
 *     tags: [Forum]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed, pinned, resolved]
 *         description: Filter by thread status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search threads by title or content
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
 *         description: Threads retrieved successfully
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
 *                     $ref: '#/components/schemas/ForumThread'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *   post:
 *     summary: Create a forum thread
 *     description: Creates a new forum thread in a category. Requires authentication.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateForumThread'
 *     responses:
 *       201:
 *         description: Thread created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumThread'
 *                 message:
 *                   type: string
 *                   example: Thread created successfully
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
 */

/**
 * @swagger
 * /api/forum/threads/{id}:
 *   get:
 *     summary: Get forum thread by ID
 *     description: Retrieves a single forum thread with details.
 *     tags: [Forum]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Thread ID
 *     responses:
 *       200:
 *         description: Thread retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumThread'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Thread not found
 *   patch:
 *     summary: Update forum thread
 *     description: Updates a forum thread. Thread author or moderators can update. All fields are optional.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Thread ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateForumThread'
 *     responses:
 *       200:
 *         description: Thread updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumThread'
 *                 message:
 *                   type: string
 *                   example: Thread updated successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Thread not found
 *   delete:
 *     summary: Delete forum thread
 *     description: Deletes a forum thread. Thread author or moderators can delete.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Thread ID
 *     responses:
 *       200:
 *         description: Thread deleted successfully
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
 *                   example: Thread deleted successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Thread not found
 */

/* ==================== POSTS ==================== */

/**
 * @swagger
 * /api/forum/threads/{id}/posts:
 *   get:
 *     summary: List posts by thread
 *     description: Retrieves a paginated list of posts for a specific thread.
 *     tags: [Forum]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Thread ID
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
 *         description: Posts retrieved successfully
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
 *                     $ref: '#/components/schemas/ForumPost'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Thread not found
 *   post:
 *     summary: Add a post to a thread
 *     description: Creates a new post in a thread. Requires authentication. Thread must be open.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Thread ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateForumPost'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumPost'
 *                 message:
 *                   type: string
 *                   example: Post created successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Thread is closed
 *       404:
 *         description: Thread not found
 */

/**
 * @swagger
 * /api/forum/posts/{id}:
 *   get:
 *     summary: Get single post by ID
 *     description: Retrieves a single forum post by its ID.
 *     tags: [Forum]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumPost'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Post not found
 *   patch:
 *     summary: Update post
 *     description: Updates a forum post. Post author or moderators can update. All fields are optional.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 10000
 *                 example: Updated post content...
 *               isSolution:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumPost'
 *                 message:
 *                   type: string
 *                   example: Post updated successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Post not found
 *   delete:
 *     summary: Delete post
 *     description: Deletes a forum post. Post author or moderators can delete.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
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
 *                   example: Post deleted successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Post not found
 */

/* ==================== REPORTS (THREADS) ==================== */

/**
 * @swagger
 * /api/forum/threads/{id}/reports:
 *   post:
 *     summary: Report a thread
 *     description: Reports a thread for moderation. Requires authentication.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Thread ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateForumReport'
 *     responses:
 *       201:
 *         description: Thread reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumReport'
 *                 message:
 *                   type: string
 *                   example: Thread reported successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */

/* ==================== REPORTS (POSTS) ==================== */

/**
 * @swagger
 * /api/forum/posts/{id}/reports:
 *   post:
 *     summary: Report a post
 *     description: Reports a post for moderation. Requires authentication.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateForumReport'
 *     responses:
 *       201:
 *         description: Post reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumReport'
 *                 message:
 *                   type: string
 *                   example: Post reported successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */

/* ==================== MODERATION REPORTS ==================== */

/**
 * @swagger
 * /api/forum/reports:
 *   get:
 *     summary: List all forum reports
 *     description: Retrieves a paginated list of forum reports for moderation. Requires admin or moderator role.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, resolved, dismissed]
 *         description: Filter by report status
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
 *         description: Reports retrieved successfully
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
 *                     $ref: '#/components/schemas/ForumReport'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/forum/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     description: Retrieves a single forum report. Requires admin or moderator role.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumReport'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Report not found
 *   patch:
 *     summary: Update report status
 *     description: Updates a forum report status. Requires admin or moderator role.
 *     tags: [Forum]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, resolved, dismissed]
 *                 example: resolved
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ForumReport'
 *                 message:
 *                   type: string
 *                   example: Report updated successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Report not found
 */
