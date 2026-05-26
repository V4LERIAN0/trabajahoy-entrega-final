/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management and verification
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCompanyRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 200
 *           example: TechCorp
 *         description:
 *           type: string
 *           example: Leading technology company
 *         website:
 *           type: string
 *           maxLength: 500
 *           example: https://techcorp.com
 *         industry:
 *           type: string
 *           maxLength: 100
 *           example: Technology
 *         size:
 *           type: string
 *           maxLength: 20
 *           example: 50-100
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *         phone:
 *           type: string
 *           maxLength: 20
 *     UpdateCompanyRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *         website:
 *           type: string
 *           maxLength: 500
 *         industry:
 *           type: string
 *           maxLength: 100
 *         size:
 *           type: string
 *           maxLength: 20
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           maxLength: 20
 *     CompanyResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         ownerId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         website:
 *           type: string
 *           nullable: true
 *         industry:
 *           type: string
 *           nullable: true
 *         size:
 *           type: string
 *           nullable: true
 *         logoUrl:
 *           type: string
 *           nullable: true
 *         coverUrl:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         isVerified:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LocationRequest:
 *       type: object
 *       required:
 *         - country
 *         - city
 *       properties:
 *         country:
 *           type: string
 *           maxLength: 100
 *           example: Spain
 *         city:
 *           type: string
 *           maxLength: 100
 *           example: Madrid
 *         address:
 *           type: string
 *           maxLength: 300
 *           nullable: true
 *           example: Calle Gran Via 1
 *         isHeadquarters:
 *           type: boolean
 *           default: false
 *     BenefitRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: Health Insurance
 *         description:
 *           type: string
 *           example: Full medical coverage
 *         icon:
 *           type: string
 *           maxLength: 50
 *           nullable: true
 *           example: health
 *     MemberRequest:
 *       type: object
 *       required:
 *         - userId
 *         - role
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         role:
 *           type: string
 *           enum: [owner, company_admin, recruiter]
 *           example: recruiter
 */

/* ==================== COMPANIES CRUD ==================== */

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: List all companies
 *     description: Retrieves a paginated list of companies with optional filtering by industry or search term.
 *     tags: [Companies]
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
 *         description: Items per page
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *         description: Filter by industry
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by company name
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
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
 *                     $ref: '#/components/schemas/CompanyResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *   post:
 *     summary: Create company
 *     description: Creates a new company. Only one company per owner allowed.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompanyRequest'
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       409:
 *         description: Company already exists for this owner
 */

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     description: Retrieves a company with its locations, benefits, and members.
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/CompanyResponse'
 *                     - type: object
 *                       properties:
 *                         locations:
 *                           type: array
 *                           items:
 *                             type: object
 *                         benefits:
 *                           type: array
 *                           items:
 *                             type: object
 *                         members:
 *                           type: array
 *                           items:
 *                             type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Company not found
 *   patch:
 *     summary: Update company
 *     description: Updates company information. Only the owner can update.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCompanyRequest'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Company not found
 *   delete:
 *     summary: Delete company
 *     description: Deletes a company. Only the owner can delete.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Company not found
 */

/* ==================== LOCATIONS ==================== */

/**
 * @swagger
 * /api/companies/{id}/locations:
 *   post:
 *     summary: Add location
 *     description: Adds a new location to a company. Only the owner can add locations.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationRequest'
 *     responses:
 *       201:
 *         description: Location added successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Company not found
 *   get:
 *     summary: List company locations
 *     description: Retrieves all locations for a company.
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Locations retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       companyId:
 *                         type: string
 *                         format: uuid
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       address:
 *                         type: string
 *                         nullable: true
 *                       isHeadquarters:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/companies/{id}/locations/{locId}:
 *   patch:
 *     summary: Update location
 *     description: Updates a company location. Only the owner can update.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *       - in: path
 *         name: locId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationRequest'
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Location not found for this company
 *   delete:
 *     summary: Delete location
 *     description: Deletes a company location. Only the owner can delete.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *       - in: path
 *         name: locId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Location not found for this company
 */

/* ==================== BENEFITS ==================== */

/**
 * @swagger
 * /api/companies/{id}/benefits:
 *   post:
 *     summary: Add benefit
 *     description: Adds a new benefit to a company. Only the owner can add benefits.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BenefitRequest'
 *     responses:
 *       201:
 *         description: Benefit added successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Company not found
 *   get:
 *     summary: List company benefits
 *     description: Retrieves all benefits for a company.
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Benefits retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       companyId:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       icon:
 *                         type: string
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/companies/{id}/benefits/{benId}:
 *   patch:
 *     summary: Update benefit
 *     description: Updates a company benefit. Only the owner can update.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *       - in: path
 *         name: benId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Benefit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BenefitRequest'
 *     responses:
 *       200:
 *         description: Benefit updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Benefit not found for this company
 *   delete:
 *     summary: Delete benefit
 *     description: Deletes a company benefit. Only the owner can delete.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *       - in: path
 *         name: benId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Benefit ID
 *     responses:
 *       200:
 *         description: Benefit deleted successfully
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Benefit not found for this company
 */

/* ==================== MEMBERS ==================== */

/**
 * @swagger
 * /api/companies/{id}/members:
 *   post:
 *     summary: Add member
 *     description: Adds a new member to a company. Accessible by owner, company_admin, or admin.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberRequest'
 *     responses:
 *       201:
 *         description: Member added successfully
 *       400:
 *         description: Validation error or user already a member
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Company not found
 *   get:
 *     summary: List company members
 *     description: Retrieves all members of a company.
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Members retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       companyId:
 *                         type: string
 *                         format: uuid
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       role:
 *                         type: string
 *                         enum: [owner, company_admin, recruiter]
 *                       joinedAt:
 *                         type: string
 *                         format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/companies/{id}/members/{memId}:
 *   patch:
 *     summary: Update member
 *     description: Updates a company member's role. Only the owner can update. Cannot change the owner's role.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *       - in: path
 *         name: memId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberRequest'
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: Cannot change owner's role
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Member not found for this company
 *   delete:
 *     summary: Remove member
 *     description: Removes a member from the company. Only the owner can remove. Cannot remove the owner.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *       - in: path
 *         name: memId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       403:
 *         description: Not the company owner or cannot remove owner
 *       404:
 *         description: Member not found for this company
 */

/* ==================== VERIFICATION ==================== */

/**
 * @swagger
 * /api/companies/{id}/verification:
 *   post:
 *     summary: Submit company for verification
 *     description: Submits company verification documents. Only the owner can submit.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - documents
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Verification documents (max 10 files)
 *     responses:
 *       201:
 *         description: Verification submitted successfully
 *       400:
 *         description: No documents provided or pending submission already exists
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Company not found
 *   get:
 *     summary: Get verification status
 *     description: Retrieves the latest verification submission for a company.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Verification status retrieved successfully
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/companies/{id}/verification/documents:
 *   get:
 *     summary: Get company verification files
 *     description: Retrieves verification documents with signed URLs.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company files retrieved successfully
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     companyId:
 *                       type: string
 *                       format: uuid
 *                     status:
 *                       type: string
 *                       enum: [pending, approved, rejected]
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *                     reviewedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     notes:
 *                       type: string
 *                       nullable: true
 *                     company_files:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           documentType:
 *                             type: string
 *                           file:
 *                             type: string
 *                             description: Signed URL
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Not the company owner
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/companies/{id}/verification/submissions/{submissionId}/review:
 *   post:
 *     summary: Review verification submission
 *     description: Admin-only endpoint to approve or reject a company verification submission.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Submission ID
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
 *                 enum: [approved, rejected]
 *                 example: approved
 *               notes:
 *                 type: string
 *                 example: All documents verified and approved
 *     responses:
 *       200:
 *         description: Verification reviewed successfully
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     status:
 *                       type: string
 *                       enum: [pending, approved, rejected]
 *                     reviewedAt:
 *                       type: string
 *                       format: date-time
 *                     notes:
 *                       type: string
 *                       nullable: true
 *                 message:
 *                   type: string
 *                   example: Verification approved successfully
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid status or submission already reviewed
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Submission not found
 */
