import { BaseRepository } from '../../common/repositories/base.repository.js';
import { AppDataSource } from '../../database/data-source.js';

import { Notification } from './models/notification.model.js';
import { JobAlert } from './models/job-alert.model.js';

export class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);

    this.jobAlertRepository = AppDataSource.getRepository(JobAlert);
  }

  // =========================================================
  // NOTIFICATION METHODS
  // =========================================================

  async findById(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createNotification(data) {
    const notification = this.repository.create(data);
    return await this.repository.save(notification);
  }

  async findByUserId(userId, { page, limit } = {}) {
    const queryBuilder = this.repository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (page && limit) {
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    return await queryBuilder.getMany();
  }

  async updateNotification(id, data) {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async markAllAsRead(userId) {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ isRead: true })
      .where('user_id = :userId', { userId })
      .andWhere('is_read = :isRead', { isRead: false })
      .execute();

    return true;
  }

  async deleteNotification(id) {
    return await this.repository.delete(id);
  }

  async countUnreadByUserId(userId) {
    return await this.repository.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // =========================================================
  // JOB ALERT METHODS
  // =========================================================

  async findAlertById(id) {
    return await this.jobAlertRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createAlert(data) {
    const alert = this.jobAlertRepository.create(data);
    return await this.jobAlertRepository.save(alert);
  }

  async findAlertsByUserId(userId, { page, limit } = {}) {
    const queryBuilder = this.jobAlertRepository
      .createQueryBuilder('alert')
      .where('alert.userId = :userId', { userId })
      .orderBy('alert.createdAt', 'DESC');

    if (page && limit) {
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    return await queryBuilder.getMany();
  }

  async updateAlert(id, data) {
    await this.jobAlertRepository.update(id, data);
    return await this.findAlertById(id);
  }

  async deleteAlert(id) {
    return await this.jobAlertRepository.delete(id);
  }
}