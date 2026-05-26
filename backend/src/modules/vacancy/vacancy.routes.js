import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../common/middlewares/role.middleware.js";
import { validateDto } from "../../common/middlewares/validation.middleware.js";
import {
  createVacancyBenefitDto,
  createJobCategoryDto,
  createVacancyDto,
  createVacancySkillDto,
} from "./dtos/create-vacancy.dto.js";
import {
  updateJobCategoryDto,
  updateVacancyBenefitDto,
  updateVacancyDto,
  updateVacancySkillDto,
} from "./dtos/update-vacancy.dto.js";
import { VacancyController } from "./vacancy.controller.js";

const router = Router();
const vacancyController = new VacancyController();

// Public routes (published vacancies)
router.get("/", vacancyController.getAll.bind(vacancyController));
router.get(
  "/categories",
  vacancyController.getCategories.bind(vacancyController),
);
router.get(
  "/categories/:id",
  vacancyController.getCategoryById.bind(vacancyController),
);

router.post(
  "/categories",
  authMiddleware,
  roleMiddleware(["admin"]),
  validateDto(createJobCategoryDto),
  vacancyController.createCategory.bind(vacancyController),
);
router.patch(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  validateDto(updateJobCategoryDto),
  vacancyController.updateCategory.bind(vacancyController),
);
router.delete(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  vacancyController.deleteCategory.bind(vacancyController),
);

router.get("/skills/:id", vacancyController.getSkill.bind(vacancyController));
router.get(
  "/benefits/:id",
  vacancyController.getBenefit.bind(vacancyController),
);
router.get("/:id/skills", vacancyController.getSkills.bind(vacancyController));
router.get(
  "/:id/benefits",
  vacancyController.getBenefits.bind(vacancyController),
);

// Authenticated routes (management)
router.get(
  "/manage/all",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  vacancyController.getAllManagement.bind(vacancyController),
);
router.get(
  "/manage/:id",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  vacancyController.getByIdManagement.bind(vacancyController),
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  validateDto(createVacancyDto),
  vacancyController.create.bind(vacancyController),
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  validateDto(updateVacancyDto),
  vacancyController.update.bind(vacancyController),
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  vacancyController.delete.bind(vacancyController),
);
router.patch(
  "/:id/close",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  vacancyController.close.bind(vacancyController),
);
router.patch(
  "/:id/archive",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  vacancyController.archive.bind(vacancyController),
);

// Skill management
router.post(
  "/:id/skills",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  validateDto(createVacancySkillDto),
  vacancyController.addSkill.bind(vacancyController),
);
router.patch(
  "/skills/:id",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  validateDto(updateVacancySkillDto),
  vacancyController.updateSkill.bind(vacancyController),
);
router.delete(
  "/skills/:id",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  vacancyController.deleteSkill.bind(vacancyController),
);

// Benefit management
router.post(
  "/:id/benefits",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  validateDto(createVacancyBenefitDto),
  vacancyController.addBenefit.bind(vacancyController),
);
router.patch(
  "/benefits/:id",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  validateDto(updateVacancyBenefitDto),
  vacancyController.updateBenefit.bind(vacancyController),
);
router.delete(
  "/benefits/:id",
  authMiddleware,
  roleMiddleware(["recruiter", "company_admin", "admin"]),
  vacancyController.deleteBenefit.bind(vacancyController),
);

router.get("/:id", vacancyController.getById.bind(vacancyController));

export default router;
