/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job applications, status tracking, comments, saved jobs, and company follows
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ApplicationStatus:
 *       type: string
 *       enum: [pending, reviewed, interview, accepted, rejected]
 *     ApplyJobRequest:
 *       type: object
 *       required:
 *         - vacancyId
 *       properties:
 *         vacancyId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440010
 *         coverLetter:
 *           type: string
 *           maxLength: 5000
 *           example: I am excited to apply for this role.
 *         cvFileUrl:
 *           type: string
 *           maxLength: 500
 *           example: https://cdn.example.com/cv/candidate.pdf
 *         resumeUrl:
 *           type: string
 *           maxLength: 500
 *           example: https://portfolio.example.com
 *     UpdateApplicationRequest:
 *       type: object
 *       properties:
 *         coverLetter:
 *           type: string
 *           maxLength: 5000
 *           nullable: true
 *         cvFileUrl:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *         resumeUrl:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *     ChangeApplicationStatusRequest:
 *       type: object
 *       required:
 *         - toStatus
 *       properties:
 *         toStatus:
 *           $ref: '#/components/schemas/ApplicationStatus'
 *         notes:
 *           type: string
 *           maxLength: 2000
 *           example: Candidate moved to interview stage.
 *     ApplicationCommentRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 3000
 *           example: Strong profile, schedule first interview.
 *     SaveJobRequest:
 *       type: object
 *       required:
 *         - vacancyId
 *       properties:
 *         vacancyId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440011
 *     FollowCompanyRequest:
 *       type: object
 *       required:
 *         - companyId
 *       properties:
 *         companyId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440012
 *     ApplicationUserRef:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *     ApplicationCompanyRef:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           nullable: true
 *     ApplicationVacancyRef:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           nullable: true
 *         companyId:
 *           type: string
 *           format: uuid
 *         company:
 *           $ref: '#/components/schemas/ApplicationCompanyRef'
 *     ApplicationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         vacancyId:
 *           type: string
 *           format: uuid
 *         status:
 *           $ref: '#/components/schemas/ApplicationStatus'
 *         coverLetter:
 *           type: string
 *           nullable: true
 *         cvFileUrl:
 *           type: string
 *           nullable: true
 *         resumeUrl:
 *           type: string
 *           nullable: true
 *         appliedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/ApplicationUserRef'
 *         vacancy:
 *           $ref: '#/components/schemas/ApplicationVacancyRef'
 *     ApplicationStatusHistoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         applicationId:
 *           type: string
 *           format: uuid
 *         fromStatus:
 *           allOf:
 *             - $ref: '#/components/schemas/ApplicationStatus'
 *           nullable: true
 *         toStatus:
 *           $ref: '#/components/schemas/ApplicationStatus'
 *         changedBy:
 *           type: string
 *           format: uuid
 *         notes:
 *           type: string
 *           nullable: true
 *         changedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         changedByUser:
 *           $ref: '#/components/schemas/ApplicationUserRef'
 *     ApplicationCommentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         applicationId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/ApplicationUserRef'
 *     SavedJobResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         vacancyId:
 *           type: string
 *           format: uuid
 *         savedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         vacancy:
 *           $ref: '#/components/schemas/ApplicationVacancyRef'
 *     CandidateCompanyFollowResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         companyId:
 *           type: string
 *           format: uuid
 *         followedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         company:
 *           $ref: '#/components/schemas/ApplicationCompanyRef'
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit application to a vacancy
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplyJobRequest'
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationResponse'
 *                 message:
 *                   type: string
 *                   example: Application submitted successfully
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
 *         description: Only candidates can apply to jobs
 *       404:
 *         description: Vacancy not found
 *       409:
 *         description: Candidate already applied
 *   get:
 *     summary: List applications with filters and pagination
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/ApplicationStatus'
 *       - in: query
 *         name: vacancyId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Applications fetched successfully
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
 *                     $ref: '#/components/schemas/ApplicationResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid query params
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden for current role or company scope
 */

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationResponse'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden for current user
 *       404:
 *         description: Application not found
 *   patch:
 *     summary: Update own pending application
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateApplicationRequest'
 *     responses:
 *       200:
 *         description: Application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationResponse'
 *                 message:
 *                   type: string
 *                   example: Application updated successfully
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
 *         description: Only the candidate owner can update
 *       404:
 *         description: Application not found
 *       409:
 *         description: Application status does not allow updates
 */

/**
 * @swagger
 * /api/applications/{id}/status:
 *   post:
 *     summary: Change application status
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeApplicationStatusRequest'
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationResponse'
 *                 message:
 *                   type: string
 *                   example: Application status updated successfully
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
 *         description: Only recruiter, company_admin, or admin can change status in allowed scope
 *       404:
 *         description: Application not found
 *       409:
 *         description: Invalid status transition
 */

/**
 * @swagger
 * /api/applications/{id}/history:
 *   get:
 *     summary: Get status history for an application
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Status history fetched successfully
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
 *                     $ref: '#/components/schemas/ApplicationStatusHistoryResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden for current user
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /api/applications/{id}/comments:
 *   post:
 *     summary: Add comment to an application
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationCommentRequest'
 *     responses:
 *       201:
 *         description: Application comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationCommentResponse'
 *                 message:
 *                   type: string
 *                   example: Application comment added successfully
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
 *         description: Forbidden for current user
 *       404:
 *         description: Application not found
 *   get:
 *     summary: List comments for an application
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Application ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Application comments fetched successfully
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
 *                     $ref: '#/components/schemas/ApplicationCommentResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden for current user
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /api/applications/comments/{id}:
 *   get:
 *     summary: Get application comment by ID
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Application comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationCommentResponse'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden for current user
 *       404:
 *         description: Application comment not found
 *   patch:
 *     summary: Update application comment by ID
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationCommentRequest'
 *     responses:
 *       200:
 *         description: Application comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationCommentResponse'
 *                 message:
 *                   type: string
 *                   example: Application comment updated successfully
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
 *         description: Forbidden for current user
 *       404:
 *         description: Application comment not found
 *   delete:
 *     summary: Delete application comment by ID
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Application comment deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden for current user
 *       404:
 *         description: Application comment not found
 */

/**
 * @swagger
 * /api/applications/saved-jobs:
 *   post:
 *     summary: Save a vacancy for current candidate
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveJobRequest'
 *     responses:
 *       201:
 *         description: Job saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/SavedJobResponse'
 *                 message:
 *                   type: string
 *                   example: Job saved successfully
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
 *         description: Only candidates can save jobs
 *       404:
 *         description: Vacancy not found
 *       409:
 *         description: Job already saved
 *   get:
 *     summary: List saved jobs for current candidate
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Saved jobs fetched successfully
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
 *                     $ref: '#/components/schemas/SavedJobResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only candidates can list saved jobs
 */

/**
 * @swagger
 * /api/applications/saved-jobs/{id}:
 *   delete:
 *     summary: Delete saved job by ID
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Saved job ID
 *     responses:
 *       200:
 *         description: Saved job deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden for current user
 *       404:
 *         description: Saved job not found
 */

/**
 * @swagger
 * /api/applications/follows:
 *   post:
 *     summary: Follow company as current candidate
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowCompanyRequest'
 *     responses:
 *       201:
 *         description: Company followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/CandidateCompanyFollowResponse'
 *                 message:
 *                   type: string
 *                   example: Company followed successfully
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
 *         description: Only candidates can follow companies
 *       404:
 *         description: Company not found
 *       409:
 *         description: Company already followed
 *   get:
 *     summary: List followed companies for current candidate
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Followed companies fetched successfully
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
 *                     $ref: '#/components/schemas/CandidateCompanyFollowResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only candidates can list followed companies
 */

/**
 * @swagger
 * /api/applications/follows/{id}:
 *   delete:
 *     summary: Unfollow company by follow ID
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Follow ID
 *     responses:
 *       200:
 *         description: Company unfollowed successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden for current user
 *       404:
 *         description: Company follow not found
 */
