import { Router } from 'express';
import { NotificationController } from './notification.controller.js';

import { authMiddleware } from '../../common/middlewares/auth.middleware.js';
import { validateDto } from '../../common/middlewares/validation.middleware.js';

import { createNotificationDto } from './dtos/create-notification.dto.js';
import { createAlertDto } from './dtos/create-alert.dto.js';
import { updateAlertDto } from './dtos/update-alert.dto.js';
import { markReadDto } from './dtos/mark-read.dto.js';

const router = Router();
const notificationController = new NotificationController();

// All notification routes require authentication
router.use(authMiddleware);

// =========================================================
// FIXED / STATIC ROUTES FIRST
// =========================================================

router.get(
  '/unread-count',
  notificationController.getUnreadCount.bind(notificationController),
);

router.patch(
  '/read-all',
  notificationController.markAllAsRead.bind(notificationController),
);

// =========================================================
// JOB ALERT ROUTES
// =========================================================

router.post(
  '/alerts',
  validateDto(createAlertDto),
  notificationController.createAlert.bind(notificationController),
);

router.get(
  '/alerts',
  notificationController.getMyAlerts.bind(notificationController),
);

router.get(
  '/alerts/:id',
  notificationController.getMyAlertById.bind(notificationController),
);

router.patch(
  '/alerts/:id',
  validateDto(updateAlertDto),
  notificationController.updateAlert.bind(notificationController),
);

router.delete(
  '/alerts/:id',
  notificationController.deleteAlert.bind(notificationController),
);

// =========================================================
// NOTIFICATION ROUTES
// =========================================================

router.get('/', notificationController.getMyNotifications.bind(notificationController));

router.post(
  '/',
  validateDto(createNotificationDto),
  notificationController.createNotification.bind(notificationController),
);

router.get(
  '/:id',
  notificationController.getMyNotificationById.bind(notificationController),
);

router.patch(
  '/:id/read',
  validateDto(markReadDto),
  notificationController.markAsRead.bind(notificationController),
);

router.delete(
  '/:id',
  notificationController.deleteNotification.bind(notificationController),
);

export default router;