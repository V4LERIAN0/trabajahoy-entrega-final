import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../common/middlewares/role.middleware.js";
import { validateDto } from "../../common/middlewares/validation.middleware.js";
import { addCommentDto, updateCommentDto } from "./dtos/add-comment.dto.js";
import { applyJobDto } from "./dtos/apply-job.dto.js";
import { changeStatusDto } from "./dtos/change-status.dto.js";
import { followCompanyDto } from "./dtos/follow-company.dto.js";
import { saveJobDto } from "./dtos/save-job.dto.js";
import { updateApplicationDto } from "./dtos/update-application.dto.js";
import { scheduleInterviewDto } from "./dtos/schedule-interview.dto.js";
import { ApplicationController } from "./application.controller.js";

const router = Router();
const applicationController = new ApplicationController();

router.use(authMiddleware);

// Applications
router.post(
  "/",
  roleMiddleware(["candidate"]),
  validateDto(applyJobDto),
  applicationController.apply.bind(applicationController),
);

router.get(
  "/",
  roleMiddleware(["candidate", "recruiter", "company_admin", "admin"]),
  applicationController.getAll.bind(applicationController),
);

router.patch(
  "/:id",
  roleMiddleware(["candidate"]),
  validateDto(updateApplicationDto),
  applicationController.update.bind(applicationController),
);

// Saved jobs
router.post(
  "/saved-jobs",
  roleMiddleware(["candidate"]),
  validateDto(saveJobDto),
  applicationController.saveJob.bind(applicationController),
);

router.get(
  "/saved-jobs",
  roleMiddleware(["candidate"]),
  applicationController.getSavedJobs.bind(applicationController),
);

router.delete(
  "/saved-jobs/:id",
  roleMiddleware(["candidate"]),
  applicationController.deleteSavedJob.bind(applicationController),
);

// Company follows
router.post(
  "/follows",
  roleMiddleware(["candidate"]),
  validateDto(followCompanyDto),
  applicationController.followCompany.bind(applicationController),
);

router.get(
  "/follows",
  roleMiddleware(["candidate"]),
  applicationController.getFollows.bind(applicationController),
);

router.delete(
  "/follows/:id",
  roleMiddleware(["candidate"]),
  applicationController.unfollowCompany.bind(applicationController),
);

// Comment by id
router.get(
  "/comments/:id",
  roleMiddleware(["candidate", "recruiter", "company_admin", "admin"]),
  applicationController.getComment.bind(applicationController),
);

router.patch(
  "/comments/:id",
  roleMiddleware(["candidate", "recruiter", "company_admin", "admin"]),
  validateDto(updateCommentDto),
  applicationController.updateComment.bind(applicationController),
);

router.delete(
  "/comments/:id",
  roleMiddleware(["candidate", "recruiter", "company_admin", "admin"]),
  applicationController.deleteComment.bind(applicationController),
);

// Status and history
router.post(
  "/:id/status",
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  validateDto(changeStatusDto),
  applicationController.changeStatus.bind(applicationController),
);

// Interview scheduling
router.post(
  "/:id/interview",
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  validateDto(scheduleInterviewDto),
  applicationController.scheduleInterview.bind(applicationController),
);

// Applicants by vacancy
router.get(
  "/vacancies/:vacancyId/applicants",
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  applicationController.getApplicantsByVacancy.bind(applicationController),
);

router.get(
  "/:id/history",
  roleMiddleware(["candidate", "recruiter", "company_admin", "admin"]),
  applicationController.getHistory.bind(applicationController),
);

// Comments by application
router.post(
  "/:id/comments",
  roleMiddleware(["candidate", "recruiter", "company_admin", "admin"]),
  validateDto(addCommentDto),
  applicationController.addComment.bind(applicationController),
);

router.get(
  "/:id/comments",
  roleMiddleware(["candidate", "recruiter", "company_admin", "admin"]),
  applicationController.getComments.bind(applicationController),
);

router.get(
  "/:id",
  roleMiddleware(["candidate", "recruiter", "company_admin", "admin"]),
  applicationController.getById.bind(applicationController),
);

export default router;
