import { ReviewRepository } from './review.repository.js';
import { AppDataSource } from '../../database/data-source.js';
import { logger } from '../../common/utils/logger.js';

export class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();

    this.companyRepository = AppDataSource.getRepository('Company');
    this.profileRepository = AppDataSource.getRepository('Profile');
  }

  // =========================================================
  // MAIN REVIEW METHODS
  // =========================================================

  async create(userId, data) {
    const company = await this.companyRepository.findOne({
      where: { id: data.companyId },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    const existingReview = await this.reviewRepository.findUserReviewForCompany(
      userId,
      data.companyId,
    );

    if (existingReview) {
      throw new Error('You have already reviewed this company');
    }

    const review = await this.reviewRepository.createReview({
      userId,
      companyId: data.companyId,
      overallRating: data.overallRating,
      workLifeBalance: data.workLifeBalance,
      compensation: data.compensation,
      culture: data.culture,
      managementRating: data.managementRating,
      careerOpportunities: data.careerOpportunities,
      title: data.title,
      pros: data.pros,
      cons: data.cons,
      reviewDate: data.reviewDate,
      isAnonymous: data.isAnonymous ?? false,
      status: 'approved',
    });

    logger.info(`Review created: ${review.id}`, {
      userId,
      companyId: data.companyId,
    });

    return await this.reviewRepository.findById(review.id);
  }

  async getById(reviewId) {
    const review = await this.reviewRepository.findByIdWithRelations(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    return review;
  }

  async getMyReviews(userId, pagination = {}) {
    const user = await this.profileRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await this.reviewRepository.findByUserId(userId, pagination);
  }

  async getApprovedByCompanyId(companyId, pagination = {}) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    return await this.reviewRepository.findApprovedByCompanyId(companyId, pagination);
  }

  async getCompanySummary(companyId) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    const summary = await this.reviewRepository.getCompanyReviewSummary(companyId);

    return {
      company: {
        id: company.id,
        name: company.name,
      },
      summary,
    };
  }

  async update(reviewId, userId, data) {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('You do not have permission to update this review');
    }

    const updatedReview = await this.reviewRepository.updateReview(reviewId, {
      ...data,
      status: 'approved',
    });

    logger.info(`Review updated: ${reviewId}`, { userId });

    return updatedReview;
  }

  async delete(reviewId, userId) {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('You do not have permission to delete this review');
    }

    await this.reviewRepository.deleteReview(reviewId);

    logger.info(`Review deleted: ${reviewId}`, { userId });

    return true;
  }

  // =========================================================
  // HELPFULNESS METHODS
  // =========================================================

  async rateHelpful(reviewId, userId, isHelpful) {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    const existingVote = await this.reviewRepository.findHelpfulnessByReviewAndUser(
      reviewId,
      userId,
    );

    let result;

    if (existingVote) {
      result = await this.reviewRepository.updateHelpfulness(existingVote.id, isHelpful);
    } else {
      result = await this.reviewRepository.addHelpfulness(reviewId, userId, isHelpful);
    }

    const helpfulCount = await this.reviewRepository.countHelpfulVotes(reviewId);

    return {
      vote: result,
      helpfulCount,
    };
  }

  async removeHelpfulVote(reviewId, userId) {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    const existingVote = await this.reviewRepository.findHelpfulnessByReviewAndUser(
      reviewId,
      userId,
    );

    if (!existingVote) {
      throw new Error('Helpful vote not found');
    }

    await this.reviewRepository.deleteHelpfulness(existingVote.id);

    const helpfulCount = await this.reviewRepository.countHelpfulVotes(reviewId);

    return {
      helpfulCount,
    };
  }

  // =========================================================
  // REPORT METHODS
  // =========================================================

  async reportReview(reviewId, userId, data) {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    const existingReport = await this.reviewRepository.findReportByReviewAndUser(
      reviewId,
      userId,
    );

    if (existingReport) {
      throw new Error('You have already reported this review');
    }

    const report = await this.reviewRepository.addReport(reviewId, userId, data);

    logger.info(`Review reported: ${reviewId}`, {
      userId,
      reportId: report.id,
    });

    return report;
  }

  async getReportsByReviewId(reviewId) {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    return await this.reviewRepository.findReportsByReviewId(reviewId);
  }

  async getReportedReviews(pagination = {}) {
    return await this.reviewRepository.findReportedReviews(pagination);
  }

  // =========================================================
  // MODERATION METHODS
  // =========================================================

  async moderateReview(reviewId, status) {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    const updatedReview = await this.reviewRepository.updateReviewStatus(reviewId, status);

    const reports = await this.reviewRepository.findReportsByReviewId(reviewId);

    for (const report of reports) {
      if (report.status === 'pending') {
        await this.reviewRepository.updateReportStatus(
          report.id,
          status === 'rejected' ? 'resolved' : 'dismissed',
        );
      }
    }

    logger.info(`Review moderated: ${reviewId}`, { status });

    return updatedReview;
  }
}