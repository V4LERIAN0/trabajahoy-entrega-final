import { Router } from 'express';
import { CompanyController } from './company.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';
import { roleMiddleware } from '../../common/middlewares/role.middleware.js';
import { validateDto } from '../../common/middlewares/validation.middleware.js';
import { createCompanyDto } from './dtos/create-company.dto.js';
import { updateCompanyDto } from './dtos/update-company.dto.js';
import { addLocationDto } from './dtos/add-location.dto.js';
import { addBenefitDto } from './dtos/add-benefit.dto.js';
import { addMemberDto } from './dtos/add-member.dto.js';
import { uploadMultiple, multerErrorHandler } from '../../common/middlewares/upload.middleware.js';

const router = Router();
const companyController = new CompanyController();

// Public routes
router.get('/', companyController.getAll.bind(companyController));
router.get('/me', authMiddleware, companyController.getMyCompany.bind(companyController));

// Dashboard (must come before /:id to keep semantics tidy — Express handles it anyway)
router.get(
  '/:id/dashboard',
  authMiddleware,
  companyController.getDashboard.bind(companyController),
);
router.get(
  '/:id/dashboard/applications-by-status',
  authMiddleware,
  companyController.getApplicationsByStatus.bind(companyController),
);
router.get(
  '/:id/dashboard/recent-applications',
  authMiddleware,
  companyController.getRecentApplications.bind(companyController),
);

router.get('/:id', companyController.getById.bind(companyController));

// Authenticated routes - Company CRUD
router.post(
  '/',
  authMiddleware,
  validateDto(createCompanyDto),
  companyController.create.bind(companyController),
);
router.patch(
  '/:id',
  authMiddleware,
  validateDto(updateCompanyDto),
  companyController.update.bind(companyController),
);
router.delete(
  '/:id',
  authMiddleware,
  companyController.delete.bind(companyController),
);

// Location management
router.post(
  '/:id/locations',
  authMiddleware,
  validateDto(addLocationDto),
  companyController.addLocation.bind(companyController),
);
router.get('/:id/locations', companyController.getLocations.bind(companyController));
router.patch(
  '/:id/locations/:locId',
  authMiddleware,
  validateDto(addLocationDto),
  companyController.updateLocation.bind(companyController),
);
router.delete(
  '/:id/locations/:locId',
  authMiddleware,
  companyController.deleteLocation.bind(companyController),
);

// Benefit management
router.post(
  '/:id/benefits',
  authMiddleware,
  validateDto(addBenefitDto),
  companyController.addBenefit.bind(companyController),
);
router.get('/:id/benefits', companyController.getBenefits.bind(companyController));
router.patch(
  '/:id/benefits/:benId',
  authMiddleware,
  validateDto(addBenefitDto),
  companyController.updateBenefit.bind(companyController),
);
router.delete(
  '/:id/benefits/:benId',
  authMiddleware,
  companyController.deleteBenefit.bind(companyController),
);

// Member management
router.post(
  '/:id/members',
  authMiddleware,
  validateDto(addMemberDto),
  companyController.addMember.bind(companyController),
);
router.get('/:id/members', companyController.getMembers.bind(companyController));
router.patch(
  '/:id/members/:memId',
  authMiddleware,
  validateDto(addMemberDto),
  companyController.updateMember.bind(companyController),
);
router.delete(
  '/:id/members/:memId',
  authMiddleware,
  companyController.removeMember.bind(companyController),
);

// Verification workflow
router.post(
  '/:id/verification',
  authMiddleware,
  uploadMultiple('documents', 10),
  multerErrorHandler,
  companyController.submitForVerification.bind(companyController),
);
router.get(
  '/:id/verification',
  authMiddleware,
  companyController.getVerificationStatus.bind(companyController),
);
router.get(
  '/:id/verification/documents',
  authMiddleware,
  companyController.getCompanyFiles.bind(companyController),
);

// Admin-only route for reviewing verification
router.post(
  '/:id/verification/submissions/:submissionId/review',
  authMiddleware,
  roleMiddleware(['admin']),
  companyController.reviewVerification.bind(companyController),
);

export default router;
