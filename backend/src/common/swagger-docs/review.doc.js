/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Company reviews, helpfulness votes, reports, and moderation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 8b34d3d6-7c8f-4bb5-9d6b-8f5a2e5d0c11
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 4b3efbc3-cf4b-4b63-bd59-c3f4e17f4b77
 *         companyId:
 *           type: string
 *           format: uuid
 *           example: 1f5b27f3-35a7-49d4-bf26-7f8c6d3b8b19
 *         overallRating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         workLifeBalance:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         compensation:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         culture:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         managementRating:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         careerOpportunities:
 *           type: integer
 *           nullable: true
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         title:
 *           type: string
 *           nullable: true
 *           example: Great place to grow
 *         pros:
 *           type: string
 *           nullable: true
 *           example: Supportive environment and good learning opportunities
 *         cons:
 *           type: string
 *           nullable: true
 *           example: Hiring decisions can be a bit slow
 *         reviewDate:
 *           type: string
 *           format: date
 *           example: 2026-04-12
 *         isAnonymous:
 *           type: boolean
 *           example: true
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateReviewRequest:
 *       type: object
 *       required:
 *         - companyId
 *         - overallRating
 *         - reviewDate
 *       properties:
 *         companyId:
 *           type: string
 *           format: uuid
 *         overallRating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         workLifeBalance:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         compensation:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         culture:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         managementRating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         careerOpportunities:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *           maxLength: 255
 *         pros:
 *           type: string
 *         cons:
 *           type: string
 *         reviewDate:
 *           type: string
 *           format: date
 *         isAnonymous:
 *           type: boolean
 *
 *     UpdateReviewRequest:
 *       type: object
 *       properties:
 *         overallRating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         workLifeBalance:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         compensation:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         culture:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         managementRating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         careerOpportunities:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *           maxLength: 255
 *         pros:
 *           type: string
 *         cons:
 *           type: string
 *         reviewDate:
 *           type: string
 *           format: date
 *         isAnonymous:
 *           type: boolean
 *
 *     RateHelpfulRequest:
 *       type: object
 *       required:
 *         - isHelpful
 *       properties:
 *         isHelpful:
 *           type: boolean
 *           example: true
 *
 *     ReportReviewRequest:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           maxLength: 100
 *           example: abusive_language
 *         description:
 *           type: string
 *           example: Contains offensive personal attacks
 *
 *     ModerateReviewRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: approved
 *
 *     ReviewSummary:
 *       type: object
 *       properties:
 *         company:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *               example: Tech Corp
 *         summary:
 *           type: object
 *           properties:
 *             totalReviews:
 *               type: integer
 *               example: 12
 *             overallRatingAvg:
 *               type: number
 *               format: float
 *               example: 4.4
 *             workLifeBalanceAvg:
 *               type: number
 *               format: float
 *               example: 4.2
 *             compensationAvg:
 *               type: number
 *               format: float
 *               example: 3.9
 *             cultureAvg:
 *               type: number
 *               format: float
 *               example: 4.6
 *             managementRatingAvg:
 *               type: number
 *               format: float
 *               example: 4.0
 *             careerOpportunitiesAvg:
 *               type: number
 *               format: float
 *               example: 4.3
 *
 *     ReviewHelpfulnessResponse:
 *       type: object
 *       properties:
 *         vote:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             reviewId:
 *               type: string
 *               format: uuid
 *             userId:
 *               type: string
 *               format: uuid
 *             isHelpful:
 *               type: boolean
 *             createdAt:
 *               type: string
 *               format: date-time
 *         helpfulCount:
 *           type: integer
 *           example: 7
 *
 *     Report:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         reviewId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         reason:
 *           type: string
 *           example: abusive_language
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [pending, resolved, dismissed]
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/reviews/company/{companyId}:
 *   get:
 *     summary: Get approved reviews for a company
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: companyId
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
 *         description: Company reviews fetched successfully
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/reviews/company/{companyId}/summary:
 *   get:
 *     summary: Get company review summary
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Company review summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ReviewSummary'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review fetched successfully
 *       404:
 *         description: Review not found
 *   patch:
 *     summary: Update my review
 *     tags: [Review]
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
 *             $ref: '#/components/schemas/UpdateReviewRequest'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: You do not have permission to update this review
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete my review
 *     tags: [Review]
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
 *         description: Review deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: You do not have permission to delete this review
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a company review
 *     tags: [Review]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Company not found
 *       409:
 *         description: You have already reviewed this company
 */

/**
 * @swagger
 * /api/reviews/me/list:
 *   get:
 *     summary: Get my reviews
 *     tags: [Review]
 *     security:
 *       - BearerAuth: []
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
 *     responses:
 *       200:
 *         description: My reviews fetched successfully
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/reviews/{id}/helpfulness:
 *   post:
 *     summary: Create or update my helpfulness vote for a review
 *     tags: [Review]
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
 *             $ref: '#/components/schemas/RateHelpfulRequest'
 *     responses:
 *       200:
 *         description: Helpful vote saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Remove my helpfulness vote from a review
 *     tags: [Review]
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
 *         description: Helpful vote removed successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Review or helpful vote not found
 */

/**
 * @swagger
 * /api/reviews/{id}/reports:
 *   post:
 *     summary: Report a review
 *     tags: [Review]
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
 *             $ref: '#/components/schemas/ReportReviewRequest'
 *     responses:
 *       201:
 *         description: Review reported successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Review not found
 *       409:
 *         description: You have already reported this review
 */

/**
 * @swagger
 * /api/reviews/admin/reported/list:
 *   get:
 *     summary: Get reviews with pending reports
 *     tags: [Review]
 *     security:
 *       - BearerAuth: []
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
 *     responses:
 *       200:
 *         description: Reported reviews fetched successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/reviews/admin/{id}/reports:
 *   get:
 *     summary: Get reports for a review
 *     tags: [Review]
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
 *         description: Reports fetched successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews/admin/{id}/status:
 *   patch:
 *     summary: Moderate a review
 *     tags: [Review]
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
 *             $ref: '#/components/schemas/ModerateReviewRequest'
 *     responses:
 *       200:
 *         description: Review moderated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Review not found
 */