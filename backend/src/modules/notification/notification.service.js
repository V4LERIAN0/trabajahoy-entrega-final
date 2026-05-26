import { NotificationRepository } from './notification.repository.js';
import { AppDataSource } from '../../database/data-source.js';
import { logger } from '../../common/utils/logger.js';

export class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.profileRepository = AppDataSource.getRepository('Profile');
  }

  // =========================================================
  // NOTIFICATION METHODS
  // =========================================================

  async createNotification(data) {
    const user = await this.profileRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await this.notificationRepository.createNotification({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
      metadata: data.metadata,
      isRead: false,
    });

    logger.info(`Notification created: ${notification.id}`, {
      userId: data.userId,
      type: data.type,
    });

    return notification;
  }

  async getMyNotifications(userId, pagination = {}) {
    const user = await this.profileRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await this.notificationRepository.findByUserId(userId, pagination);
  }

  async getMyNotificationById(notificationId, userId) {
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('You do not have permission to access this notification');
    }

    return notification;
  }

  async markAsRead(notificationId, userId, isRead) {
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('You do not have permission to update this notification');
    }

    const updatedNotification = await this.notificationRepository.updateNotification(
      notificationId,
      { isRead },
    );

    logger.info(`Notification updated: ${notificationId}`, {
      userId,
      isRead,
    });

    return updatedNotification;
  }

  async markAllAsRead(userId) {
    const user = await this.profileRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.notificationRepository.markAllAsRead(userId);

    const unreadCount = await this.notificationRepository.countUnreadByUserId(userId);

    logger.info(`All notifications marked as read for user: ${userId}`);

    return {
      unreadCount,
    };
  }

  async deleteNotification(notificationId, userId) {
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('You do not have permission to delete this notification');
    }

    await this.notificationRepository.deleteNotification(notificationId);

    logger.info(`Notification deleted: ${notificationId}`, { userId });

    return true;
  }

  async getUnreadCount(userId) {
    const user = await this.profileRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const unreadCount = await this.notificationRepository.countUnreadByUserId(userId);

    return {
      unreadCount,
    };
  }

  // =========================================================
  // JOB ALERT METHODS
  // =========================================================

  async createAlert(userId, data) {
    const user = await this.profileRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const alert = await this.notificationRepository.createAlert({
      userId,
      keywords: data.keywords,
      location: data.location,
      type: data.type,
      modality: data.modality,
      level: data.level,
      frequency: data.frequency,
      isActive: data.isActive ?? true,
    });

    logger.info(`Job alert created: ${alert.id}`, {
      userId,
      frequency: data.frequency,
    });

    return alert;
  }

  async getMyAlerts(userId, pagination = {}) {
    const user = await this.profileRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await this.notificationRepository.findAlertsByUserId(userId, pagination);
  }

  async getMyAlertById(alertId, userId) {
    const alert = await this.notificationRepository.findAlertById(alertId);

    if (!alert) {
      throw new Error('Job alert not found');
    }

    if (alert.userId !== userId) {
      throw new Error('You do not have permission to access this job alert');
    }

    return alert;
  }

  async updateAlert(alertId, userId, data) {
    const alert = await this.notificationRepository.findAlertById(alertId);

    if (!alert) {
      throw new Error('Job alert not found');
    }

    if (alert.userId !== userId) {
      throw new Error('You do not have permission to update this job alert');
    }

    const updatedAlert = await this.notificationRepository.updateAlert(alertId, data);

    logger.info(`Job alert updated: ${alertId}`, { userId });

    return updatedAlert;
  }

  async deleteAlert(alertId, userId) {
    const alert = await this.notificationRepository.findAlertById(alertId);

    if (!alert) {
      throw new Error('Job alert not found');
    }

    if (alert.userId !== userId) {
      throw new Error('You do not have permission to delete this job alert');
    }

    await this.notificationRepository.deleteAlert(alertId);

    logger.info(`Job alert deleted: ${alertId}`, { userId });

    return true;
  }
}