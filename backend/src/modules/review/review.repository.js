import { BaseRepository } from '../../common/repositories/base.repository.js';
import { AppDataSource } from '../../database/data-source.js';

import { CompanyReview } from './models/company-review.model.js';
import { ReviewHelpfulness } from './models/review-helpfulness.model.js';
import { ReviewReport } from './models/review-report.model.js';

export class ReviewRepository extends BaseRepository {
  constructor() {
    super(CompanyReview);

    this.helpfulnessRepository = AppDataSource.getRepository(ReviewHelpfulness);
    this.reportRepository = AppDataSource.getRepository(ReviewReport);
  }

  // =========================================================
  // MAIN REVIEW METHODS
  // =========================================================

  async findById(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['user', 'company'],
    });
  }

  async findByIdWithRelations(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['user', 'company', 'helpfulnessVotes', 'reports'],
    });
  }

  async createReview(data) {
    const review = this.repository.create(data);
    return await this.repository.save(review);
  }

  async updateReview(id, data) {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async deleteReview(id) {
    return await this.repository.delete(id);
  }

  async findByUserId(userId, { page, limit } = {}) {
    const queryBuilder = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.company', 'company')
      .where('review.userId = :userId', { userId })
      .orderBy('review.createdAt', 'DESC');

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

  async findApprovedByCompanyId(companyId, { page, limit } = {}) {
    const queryBuilder = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.companyId = :companyId', { companyId })
      .andWhere('review.status = :status', { status: 'approved' })
      .orderBy('review.createdAt', 'DESC');

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

  async findPendingByCompanyId(companyId, { page, limit } = {}) {
    const queryBuilder = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.companyId = :companyId', { companyId })
      .andWhere('review.status = :status', { status: 'pending' })
      .orderBy('review.createdAt', 'DESC');

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

  async findReportedReviews({ page, limit } = {}) {
    const queryBuilder = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.company', 'company')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.reports', 'reports')
      .where('reports.status = :status', { status: 'pending' })
      .orderBy('review.createdAt', 'DESC');

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

  async findUserReviewForCompany(userId, companyId) {
    return await this.repository.findOne({
      where: { userId, companyId },
    });
  }

  async updateReviewStatus(id, status) {
    await this.repository.update(id, { status });
    return await this.findById(id);
  }

  // =========================================================
  // REVIEW SUMMARY METHODS
  // =========================================================

  async getCompanyReviewSummary(companyId) {
    const result = await this.repository
      .createQueryBuilder('review')
      .select('COUNT(review.id)', 'totalReviews')
      .addSelect('AVG(review.overallRating)', 'overallRatingAvg')
      .addSelect('AVG(review.workLifeBalance)', 'workLifeBalanceAvg')
      .addSelect('AVG(review.compensation)', 'compensationAvg')
      .addSelect('AVG(review.culture)', 'cultureAvg')
      .addSelect('AVG(review.managementRating)', 'managementRatingAvg')
      .addSelect('AVG(review.careerOpportunities)', 'careerOpportunitiesAvg')
      .where('review.companyId = :companyId', { companyId })
      .andWhere('review.status = :status', { status: 'approved' })
      .getRawOne();

    return {
      totalReviews: Number(result?.totalReviews || 0),
      overallRatingAvg: result?.overallRatingAvg ? Number(result.overallRatingAvg) : 0,
      workLifeBalanceAvg: result?.workLifeBalanceAvg ? Number(result.workLifeBalanceAvg) : 0,
      compensationAvg: result?.compensationAvg ? Number(result.compensationAvg) : 0,
      cultureAvg: result?.cultureAvg ? Number(result.cultureAvg) : 0,
      managementRatingAvg: result?.managementRatingAvg ? Number(result.managementRatingAvg) : 0,
      careerOpportunitiesAvg: result?.careerOpportunitiesAvg ? Number(result.careerOpportunitiesAvg) : 0,
    };
  }

  // =========================================================
  // HELPFULNESS METHODS
  // =========================================================

  async findHelpfulnessById(id) {
    return await this.helpfulnessRepository.findOne({
      where: { id },
      relations: ['review', 'user'],
    });
  }

  async findHelpfulnessByReviewAndUser(reviewId, userId) {
    return await this.helpfulnessRepository.findOne({
      where: { reviewId, userId },
    });
  }

  async addHelpfulness(reviewId, userId, isHelpful) {
    const helpfulness = this.helpfulnessRepository.create({
      reviewId,
      userId,
      isHelpful,
    });

    return await this.helpfulnessRepository.save(helpfulness);
  }

  async updateHelpfulness(id, isHelpful) {
    await this.helpfulnessRepository.update(id, { isHelpful });
    return await this.findHelpfulnessById(id);
  }

  async deleteHelpfulness(id) {
    return await this.helpfulnessRepository.delete(id);
  }

  async countHelpfulVotes(reviewId) {
    return await this.helpfulnessRepository.count({
      where: {
        reviewId,
        isHelpful: true,
      },
    });
  }

  // =========================================================
  // REPORT METHODS
  // =========================================================

  async findReportById(id) {
    return await this.reportRepository.findOne({
      where: { id },
      relations: ['review', 'user'],
    });
  }

  async findReportByReviewAndUser(reviewId, userId) {
    return await this.reportRepository.findOne({
      where: { reviewId, userId },
    });
  }

  async addReport(reviewId, userId, data) {
    const report = this.reportRepository.create({
      reviewId,
      userId,
      ...data,
    });

    return await this.reportRepository.save(report);
  }

  async findReportsByReviewId(reviewId) {
    return await this.reportRepository.find({
      where: { reviewId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateReportStatus(id, status) {
    await this.reportRepository.update(id, { status });
    return await this.findReportById(id);
  }
}