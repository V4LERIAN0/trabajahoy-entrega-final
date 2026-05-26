import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';
import { roleMiddleware } from '../../common/middlewares/role.middleware.js';
import { validateDto } from '../../common/middlewares/validation.middleware.js';

import { assignRoleDto } from './dtos/assign-role.dto.js';
import { removeRoleDto } from './dtos/remove-role.dto.js';
import { createAdminUserDto } from './dtos/create-admin-user.dto.js';
import { updateAdminUserDto } from './dtos/update-admin-user.dto.js';
import { createAdminCompanyDto } from './dtos/create-admin-company.dto.js';
import { updateAdminCompanyDto } from './dtos/update-admin-company.dto.js';

const router = Router();
const adminController = new AdminController();

router.use(authMiddleware);

router.get(
  '/dashboard',
  roleMiddleware(['admin']),
  adminController.getDashboard.bind(adminController),
);

router.get(
  '/roles',
  roleMiddleware(['admin']),
  adminController.getAllRoles.bind(adminController),
);

router.get(
  '/roles/:name/users',
  roleMiddleware(['admin']),
  adminController.getUsersByRole.bind(adminController),
);

// Admin user CRUD
router.get(
  '/users',
  roleMiddleware(['admin']),
  adminController.getAllUsers.bind(adminController),
);

router.post(
  '/users',
  roleMiddleware(['admin']),
  validateDto(createAdminUserDto),
  adminController.createUser.bind(adminController),
);

router.patch(
  '/users/:id',
  roleMiddleware(['admin']),
  validateDto(updateAdminUserDto),
  adminController.updateUser.bind(adminController),
);

router.delete(
  '/users/:id',
  roleMiddleware(['admin']),
  adminController.deleteUser.bind(adminController),
);

// User role management
router.get(
  '/users/:id/roles',
  roleMiddleware(['admin']),
  adminController.getUserRoles.bind(adminController),
);

router.post(
  '/users/:id/roles',
  roleMiddleware(['admin']),
  validateDto(assignRoleDto),
  adminController.assignRole.bind(adminController),
);

router.delete(
  '/users/:id/roles',
  roleMiddleware(['admin']),
  validateDto(removeRoleDto),
  adminController.removeRole.bind(adminController),
);

// Admin company CRUD
router.get(
  '/companies',
  roleMiddleware(['admin']),
  adminController.getAllCompanies.bind(adminController),
);

router.post(
  '/companies',
  roleMiddleware(['admin']),
  validateDto(createAdminCompanyDto),
  adminController.createCompany.bind(adminController),
);

router.patch(
  '/companies/:id',
  roleMiddleware(['admin']),
  validateDto(updateAdminCompanyDto),
  adminController.updateCompany.bind(adminController),
);

router.delete(
  '/companies/:id',
  roleMiddleware(['admin']),
  adminController.deleteCompany.bind(adminController),
);

export default router;