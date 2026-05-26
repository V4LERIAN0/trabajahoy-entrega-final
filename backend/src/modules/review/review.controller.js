import { ReviewService } from './review.service.js';
import { parsePagination } from '../../common/utils/paginator.js';

const reviewService = new ReviewService();

export class ReviewController {
  // =========================================================
  // MAIN REVIEW METHODS
  // =========================================================

  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const review = await reviewService.create(userId, req.body);

      res.status(201).json({
        data: review,
        message: 'Review created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const review = await reviewService.getById(id);

      res.status(200).json({
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyReviews(req, res, next) {
    try {
      const userId = req.user.id;
      const pagination = parsePagination(req);

      const reviews = await reviewService.getMyReviews(userId, pagination);

      res.status(200).json({
        data: reviews.data || reviews,
        ...(reviews.pagination && { pagination: reviews.pagination }),
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyReviews(req, res, next) {
    try {
      const { companyId } = req.params;
      const pagination = parsePagination(req);

      const reviews = await reviewService.getApprovedByCompanyId(companyId, pagination);

      res.status(200).json({
        data: reviews.data || reviews,
        ...(reviews.pagination && { pagination: reviews.pagination }),
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanySummary(req, res, next) {
    try {
      const { companyId } = req.params;
      const summary = await reviewService.getCompanySummary(companyId);

      res.status(200).json({
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const updatedReview = await reviewService.update(id, userId, req.body);

      res.status(200).json({
        data: updatedReview,
        message: 'Review updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await reviewService.delete(id, userId);

      res.status(200).json({
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // HELPFULNESS METHODS
  // =========================================================

  async rateHelpful(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { isHelpful } = req.body;

      const result = await reviewService.rateHelpful(id, userId, isHelpful);

      res.status(200).json({
        data: result,
        message: 'Helpful vote saved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async removeHelpfulVote(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await reviewService.removeHelpfulVote(id, userId);

      res.status(200).json({
        data: result,
        message: 'Helpful vote removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // REPORT METHODS
  // =========================================================

  async reportReview(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const report = await reviewService.reportReview(id, userId, req.body);

      res.status(201).json({
        data: report,
        message: 'Review reported successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getReportsByReviewId(req, res, next) {
    try {
      const { id } = req.params;
      const reports = await reviewService.getReportsByReviewId(id);

      res.status(200).json({
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReportedReviews(req, res, next) {
    try {
      const pagination = parsePagination(req);
      const reviews = await reviewService.getReportedReviews(pagination);

      res.status(200).json({
        data: reviews.data || reviews,
        ...(reviews.pagination && { pagination: reviews.pagination }),
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // MODERATION METHODS
  // =========================================================

  async moderateReview(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedReview = await reviewService.moderateReview(id, status);

      res.status(200).json({
        data: updatedReview,
        message: 'Review moderated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}