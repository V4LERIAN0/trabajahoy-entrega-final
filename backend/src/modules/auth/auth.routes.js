import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';
import { validateDto } from '../../common/middlewares/validation.middleware.js';
import { registerDto } from './dtos/register.dto.js';
import { registerCompanyDto } from './dtos/register-company.dto.js';
import { loginDto } from './dtos/login.dto.js';
import { refreshTokenDto } from './dtos/refresh-token.dto.js';

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  '/register',
  validateDto(registerDto),
  authController.register.bind(authController),
);
router.post(
  '/register-company',
  validateDto(registerCompanyDto),
  authController.registerCompany.bind(authController),
);
router.post(
  '/login',
  validateDto(loginDto),
  authController.login.bind(authController),
);
router.post(
  '/refresh',
  validateDto(refreshTokenDto),
  authController.refresh.bind(authController),
);

// Protected routes
router.post(
  '/logout',
  authMiddleware,
  authController.logout.bind(authController),
);
router.get(
  '/me',
  authMiddleware,
  authController.getMe.bind(authController),
);

export default router;
