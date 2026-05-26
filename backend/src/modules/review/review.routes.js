import { Router } from 'express';
import { ReviewController } from './review.controller.js';

import { authMiddleware } from '../../common/middlewares/auth.middleware.js';
import { roleMiddleware } from '../../common/middlewares/role.middleware.js';
import { validateDto } from '../../common/middlewares/validation.middleware.js';

import { createReviewDto } from './dtos/create-review.dto.js';
import { updateReviewDto } from './dtos/update-review.dto.js';
import { rateHelpfulDto } from './dtos/rate-helpful.dto.js';
import { reportReviewDto } from './dtos/report-review.dto.js';
import { moderateReviewDto } from './dtos/moderate-review.dto.js';

const router = Router();
const reviewController = new ReviewController();

// =========================================================
// PUBLIC ROUTES
// =========================================================

router.get('/company/:companyId', reviewController.getCompanyReviews.bind(reviewController));
router.get(
  '/company/:companyId/summary',
  reviewController.getCompanySummary.bind(reviewController),
);
router.get('/:id', reviewController.getById.bind(reviewController));

// =========================================================
// AUTHENTICATED ROUTES
// =========================================================

router.use(authMiddleware);

router.get('/me/list', reviewController.getMyReviews.bind(reviewController));

router.post(
  '/',
  validateDto(createReviewDto),
  reviewController.create.bind(reviewController),
);

router.patch(
  '/:id',
  validateDto(updateReviewDto),
  reviewController.update.bind(reviewController),
);

router.delete('/:id', reviewController.delete.bind(reviewController));

router.post(
  '/:id/helpfulness',
  validateDto(rateHelpfulDto),
  reviewController.rateHelpful.bind(reviewController),
);

router.delete('/:id/helpfulness', reviewController.removeHelpfulVote.bind(reviewController));

router.post(
  '/:id/reports',
  validateDto(reportReviewDto),
  reviewController.reportReview.bind(reviewController),
);

// =========================================================
// ADMIN / MODERATOR ROUTES
// =========================================================

router.get(
  '/admin/reported/list',
  roleMiddleware(['admin', 'moderator']),
  reviewController.getReportedReviews.bind(reviewController),
);

router.get(
  '/admin/:id/reports',
  roleMiddleware(['admin', 'moderator']),
  reviewController.getReportsByReviewId.bind(reviewController),
);

router.patch(
  '/admin/:id/status',
  roleMiddleware(['admin', 'moderator']),
  validateDto(moderateReviewDto),
  reviewController.moderateReview.bind(reviewController),
);

export default router;