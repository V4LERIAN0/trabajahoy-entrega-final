import { NotificationService } from './notification.service.js';
import { parsePagination } from '../../common/utils/paginator.js';

const notificationService = new NotificationService();

export class NotificationController {
  // =========================================================
  // NOTIFICATION METHODS
  // =========================================================

  async createNotification(req, res, next) {
    try {
      const notification = await notificationService.createNotification(req.body);

      res.status(201).json({
        data: notification,
        message: 'Notification created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const pagination = parsePagination(req);

      const notifications = await notificationService.getMyNotifications(userId, pagination);

      res.status(200).json({
        data: notifications.data || notifications,
        ...(notifications.pagination && { pagination: notifications.pagination }),
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyNotificationById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await notificationService.getMyNotificationById(id, userId);

      res.status(200).json({
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { isRead } = req.body;

      const notification = await notificationService.markAsRead(id, userId, isRead);

      res.status(200).json({
        data: notification,
        message: 'Notification updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;

      const result = await notificationService.markAllAsRead(userId);

      res.status(200).json({
        data: result,
        message: 'All notifications marked as read successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await notificationService.deleteNotification(id, userId);

      res.status(200).json({
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.id;

      const result = await notificationService.getUnreadCount(userId);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // JOB ALERT METHODS
  // =========================================================

  async createAlert(req, res, next) {
    try {
      const userId = req.user.id;

      const alert = await notificationService.createAlert(userId, req.body);

      res.status(201).json({
        data: alert,
        message: 'Job alert created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyAlerts(req, res, next) {
    try {
      const userId = req.user.id;
      const pagination = parsePagination(req);

      const alerts = await notificationService.getMyAlerts(userId, pagination);

      res.status(200).json({
        data: alerts.data || alerts,
        ...(alerts.pagination && { pagination: alerts.pagination }),
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyAlertById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const alert = await notificationService.getMyAlertById(id, userId);

      res.status(200).json({
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAlert(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const alert = await notificationService.updateAlert(id, userId, req.body);

      res.status(200).json({
        data: alert,
        message: 'Job alert updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAlert(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await notificationService.deleteAlert(id, userId);

      res.status(200).json({
        message: 'Job alert deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}