/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: User notifications and job alerts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           example: application_status_changed
 *         title:
 *           type: string
 *           example: Application updated
 *         message:
 *           type: string
 *           example: Your application status has changed.
 *         isRead:
 *           type: boolean
 *           example: false
 *         link:
 *           type: string
 *           nullable: true
 *           example: /applications/123
 *         metadata:
 *           type: object
 *           nullable: true
 *           example:
 *             applicationId: 123
 *             status: shortlisted
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateNotificationRequest:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *         - title
 *         - message
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           maxLength: 100
 *           example: system_announcement
 *         title:
 *           type: string
 *           maxLength: 255
 *           example: Welcome to TrabajaHoy
 *         message:
 *           type: string
 *           example: Your account is now active.
 *         link:
 *           type: string
 *           maxLength: 500
 *           example: /dashboard
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *
 *     MarkReadRequest:
 *       type: object
 *       required:
 *         - isRead
 *       properties:
 *         isRead:
 *           type: boolean
 *           example: true
 *
 *     JobAlert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *           example: [java, backend]
 *         location:
 *           type: string
 *           nullable: true
 *           example: San Salvador
 *         type:
 *           type: string
 *           nullable: true
 *           enum: [full-time, part-time, contract, freelance, internship]
 *         modality:
 *           type: string
 *           nullable: true
 *           enum: [remote, hybrid, onsite]
 *         level:
 *           type: string
 *           nullable: true
 *           enum: [junior, mid, senior, lead, manager, director]
 *         frequency:
 *           type: string
 *           enum: [daily, weekly]
 *           example: daily
 *         isActive:
 *           type: boolean
 *           example: true
 *         lastSentAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateAlertRequest:
 *       type: object
 *       required:
 *         - frequency
 *       properties:
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *           example: [java, backend]
 *         location:
 *           type: string
 *           maxLength: 255
 *           example: Santa Ana
 *         type:
 *           type: string
 *           enum: [full-time, part-time, contract, freelance, internship]
 *         modality:
 *           type: string
 *           enum: [remote, hybrid, onsite]
 *         level:
 *           type: string
 *           enum: [junior, mid, senior, lead, manager, director]
 *         frequency:
 *           type: string
 *           enum: [daily, weekly]
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateAlertRequest:
 *       type: object
 *       properties:
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *         location:
 *           type: string
 *           maxLength: 255
 *         type:
 *           type: string
 *           enum: [full-time, part-time, contract, freelance, internship]
 *         modality:
 *           type: string
 *           enum: [remote, hybrid, onsite]
 *         level:
 *           type: string
 *           enum: [junior, mid, senior, lead, manager, director]
 *         frequency:
 *           type: string
 *           enum: [daily, weekly]
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get my notifications
 *     tags: [Notification]
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
 *         description: Notifications fetched successfully
 *       401:
 *         description: Not authenticated
 *   post:
 *     summary: Create a notification
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationRequest'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count fetched successfully
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get one of my notifications
 *     tags: [Notification]
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
 *         description: Notification fetched successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: No permission
 *       404:
 *         description: Notification not found
 *   delete:
 *     summary: Delete one of my notifications
 *     tags: [Notification]
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
 *         description: Notification deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: No permission
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark one notification as read or unread
 *     tags: [Notification]
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
 *             $ref: '#/components/schemas/MarkReadRequest'
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: No permission
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all my notifications as read
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/notifications/alerts:
 *   post:
 *     summary: Create a job alert
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAlertRequest'
 *     responses:
 *       201:
 *         description: Job alert created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *   get:
 *     summary: Get my job alerts
 *     tags: [Notification]
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
 *         description: Job alerts fetched successfully
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/notifications/alerts/{id}:
 *   get:
 *     summary: Get one of my job alerts
 *     tags: [Notification]
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
 *         description: Job alert fetched successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: No permission
 *       404:
 *         description: Job alert not found
 *   patch:
 *     summary: Update one of my job alerts
 *     tags: [Notification]
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
 *             $ref: '#/components/schemas/UpdateAlertRequest'
 *     responses:
 *       200:
 *         description: Job alert updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: No permission
 *       404:
 *         description: Job alert not found
 *   delete:
 *     summary: Delete one of my job alerts
 *     tags: [Notification]
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
 *         description: Job alert deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: No permission
 *       404:
 *         description: Job alert not found
 */