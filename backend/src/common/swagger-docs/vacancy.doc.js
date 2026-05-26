/**
 * @swagger
 * tags:
 *   name: Vacancy
 *   description: Vacancy and job category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateVacancyRequest:
 *       type: object
 *       required:
 *         - companyId
 *         - title
 *         - description
 *         - requirements
 *         - country
 *         - city
 *       properties:
 *         companyId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         title:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *         requirements:
 *           type: string
 *         benefitsText:
 *           type: string
 *           nullable: true
 *         salaryMin:
 *           type: number
 *           minimum: 0
 *           nullable: true
 *         salaryMax:
 *           type: number
 *           minimum: 0
 *           nullable: true
 *         currency:
 *           type: string
 *           maxLength: 10
 *           example: USD
 *         type:
 *           type: string
 *           enum: [full-time, part-time, contract, freelance, internship]
 *         modality:
 *           type: string
 *           enum: [remote, hybrid, onsite]
 *         level:
 *           type: string
 *           enum: [junior, mid, senior, lead, manager, director]
 *         status:
 *           type: string
 *           enum: [draft, published, closed, archived]
 *         country:
 *           type: string
 *           maxLength: 100
 *         city:
 *           type: string
 *           maxLength: 100
 *         locationText:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *         applicationDeadline:
 *           type: string
 *           pattern: '^\\d{4}-\\d{2}-\\d{2}$'
 *           example: 2026-12-31
 *         openings:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *     UpdateVacancyRequest:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         title:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *         requirements:
 *           type: string
 *         benefitsText:
 *           type: string
 *           nullable: true
 *         salaryMin:
 *           type: number
 *           minimum: 0
 *           nullable: true
 *         salaryMax:
 *           type: number
 *           minimum: 0
 *           nullable: true
 *         currency:
 *           type: string
 *           maxLength: 10
 *         type:
 *           type: string
 *           enum: [full-time, part-time, contract, freelance, internship]
 *         modality:
 *           type: string
 *           enum: [remote, hybrid, onsite]
 *         level:
 *           type: string
 *           enum: [junior, mid, senior, lead, manager, director]
 *         status:
 *           type: string
 *           enum: [draft, published, closed, archived]
 *         country:
 *           type: string
 *           maxLength: 100
 *         city:
 *           type: string
 *           maxLength: 100
 *         locationText:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *         applicationDeadline:
 *           type: string
 *           pattern: '^\\d{4}-\\d{2}-\\d{2}$'
 *           nullable: true
 *         openings:
 *           type: integer
 *           minimum: 1
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     VacancyResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         companyId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         requirements:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, published, closed, archived]
 *         type:
 *           type: string
 *           enum: [full-time, part-time, contract, freelance, internship]
 *         modality:
 *           type: string
 *           enum: [remote, hybrid, onsite]
 *         level:
 *           type: string
 *           enum: [junior, mid, senior, lead, manager, director]
 *         country:
 *           type: string
 *         city:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     VacancySkillRequest:
 *       type: object
 *       required:
 *         - skillName
 *       properties:
 *         skillName:
 *           type: string
 *           maxLength: 100
 *         isRequired:
 *           type: boolean
 *           default: true
 *     VacancyBenefitRequest:
 *       type: object
 *       required:
 *         - benefitName
 *       properties:
 *         benefitName:
 *           type: string
 *           maxLength: 100
 *     CreateJobCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *         slug:
 *           type: string
 *           maxLength: 100
 *           example: software-development
 *         description:
 *           type: string
 *           nullable: true
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *     UpdateJobCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *         slug:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *           nullable: true
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *     JobCategoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/vacancies:
 *   get:
 *     summary: List published vacancies
 *     description: Retrieve a paginated list of published vacancies with optional filters. Empty string values for query parameters are treated as not provided.
 *     tags: [Vacancy]
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
 *         description: Items per page (max 100)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for title/description
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by company UUID
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category UUID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, closed, archived]
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, freelance, internship]
 *         description: Filter by job type
 *       - in: query
 *         name: modality
 *         schema:
 *           type: string
 *           enum: [remote, hybrid, onsite]
 *         description: Filter by work modality
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [junior, mid, senior, lead, manager, director]
 *         description: Filter by experience level
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *     responses:
 *       200:
 *         description: Vacancies fetched successfully
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
 *                     $ref: '#/components/schemas/VacancyResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *   post:
 *     summary: Create vacancy
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVacancyRequest'
 *     responses:
 *       201:
 *         description: Vacancy created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *
 * /api/vacancies/{id}:
 *   get:
 *     summary: Get published vacancy by id
 *     tags: [Vacancy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vacancy fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/VacancyResponse'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Vacancy not found
 *   patch:
 *     summary: Update vacancy
 *     description: Status transitions are restricted to draft->published, published->closed, and closed->archived.
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVacancyRequest'
 *     responses:
 *       200:
 *         description: Vacancy updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Conflict (invalid status transition)
 *       404:
 *         description: Vacancy not found
 *   delete:
 *     summary: Delete vacancy
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vacancy deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vacancy not found
 *
 * /api/vacancies/manage/all:
 *   get:
 *     summary: List vacancies for management
 *     description: Retrieve a paginated list of vacancies for management. Empty string values for query parameters are treated as not provided.
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
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
 *         description: Items per page (max 100)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by company UUID
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category UUID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, closed, archived]
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, freelance, internship]
 *         description: Filter by job type
 *       - in: query
 *         name: modality
 *         schema:
 *           type: string
 *           enum: [remote, hybrid, onsite]
 *         description: Filter by work modality
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [junior, mid, senior, lead, manager, director]
 *         description: Filter by experience level
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *     responses:
 *       200:
 *         description: Managed vacancies fetched successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *
 * /api/vacancies/manage/{id}:
 *   get:
 *     summary: Get vacancy by id for management
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Managed vacancy fetched successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vacancy not found
 *
 * /api/vacancies/{id}/close:
 *   patch:
 *     summary: Close vacancy
 *     description: Valid only for published vacancies.
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vacancy closed successfully
 *       409:
 *         description: Conflict (invalid status transition)
 *
 * /api/vacancies/{id}/archive:
 *   patch:
 *     summary: Archive vacancy
 *     description: Valid only for closed vacancies.
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vacancy archived successfully
 *       409:
 *         description: Conflict (invalid status transition)
 *
 * /api/vacancies/{id}/skills:
 *   get:
 *     summary: List skills for a published vacancy
 *     tags: [Vacancy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Vacancy skills fetched successfully
 *   post:
 *     summary: Add skill to vacancy
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VacancySkillRequest'
 *     responses:
 *       201:
 *         description: Vacancy skill added successfully
 *       409:
 *         description: Conflict (skill already exists for vacancy)
 *
 * /api/vacancies/skills/{id}:
 *   get:
 *     summary: Get vacancy skill by id
 *     tags: [Vacancy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vacancy skill fetched successfully
 *   patch:
 *     summary: Update vacancy skill
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VacancySkillRequest'
 *     responses:
 *       200:
 *         description: Vacancy skill updated successfully
 *       409:
 *         description: Conflict (skill already exists for vacancy)
 *   delete:
 *     summary: Delete vacancy skill
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vacancy skill deleted successfully
 *
 * /api/vacancies/{id}/benefits:
 *   get:
 *     summary: List benefits for a published vacancy
 *     tags: [Vacancy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Vacancy benefits fetched successfully
 *   post:
 *     summary: Add benefit to vacancy
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VacancyBenefitRequest'
 *     responses:
 *       201:
 *         description: Vacancy benefit added successfully
 *       409:
 *         description: Conflict (benefit already exists for vacancy)
 *
 * /api/vacancies/benefits/{id}:
 *   get:
 *     summary: Get vacancy benefit by id
 *     tags: [Vacancy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vacancy benefit fetched successfully
 *   patch:
 *     summary: Update vacancy benefit
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VacancyBenefitRequest'
 *     responses:
 *       200:
 *         description: Vacancy benefit updated successfully
 *       409:
 *         description: Conflict (benefit already exists for vacancy)
 *   delete:
 *     summary: Delete vacancy benefit
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vacancy benefit deleted successfully
 *
 * /api/vacancies/categories:
 *   get:
 *     summary: List job categories
 *     tags: [Vacancy]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *   post:
 *     summary: Create job category
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (admin only)
 *       409:
 *         description: Conflict (slug already exists)
 *
 * /api/vacancies/categories/{id}:
 *   get:
 *     summary: Get job category by id
 *     tags: [Vacancy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *       404:
 *         description: Category not found
 *   patch:
 *     summary: Update job category
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJobCategoryRequest'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Category not found
 *       409:
 *         description: Conflict (slug duplicate or invalid hierarchy)
 *   delete:
 *     summary: Delete job category
 *     tags: [Vacancy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Category not found
 *       409:
 *         description: Conflict (category has child categories)
 */
