import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ResourceController } from './resource.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';
import { roleMiddleware } from '../../common/middlewares/role.middleware.js';
import { validateDto } from '../../common/middlewares/validation.middleware.js';
import { JWT_SECRET } from '../../common/config/constants.js';
import { createResourceDto } from './dtos/create-resource.dto.js';
import { updateResourceDto } from './dtos/update-resource.dto.js';
import { createResourceCategoryDto, updateResourceCategoryDto } from './dtos/create-resource-category.dto.js';
import { rateResourceDto } from './dtos/rate-resource.dto.js';
import { createRelatedResourceDto } from './dtos/create-related-resource.dto.js';

const router = Router();
const resourceController = new ResourceController();

const optionalAuthMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return next();
	}

	try {
		const token = authHeader.split(' ')[1];
		req.user = jwt.verify(token, JWT_SECRET);
	} catch (error) {
		// Ignore invalid token here to keep endpoint public.
	}

	return next();
};

// Public endpoints
router.get('/categories', resourceController.getCategories.bind(resourceController));
router.get('/categories/:id', resourceController.getCategoryById.bind(resourceController));

router.get('/', optionalAuthMiddleware, resourceController.getResources.bind(resourceController));
router.get('/:id', optionalAuthMiddleware, resourceController.getResourceById.bind(resourceController));
router.get('/:id/ratings', optionalAuthMiddleware, resourceController.getResourceRatings.bind(resourceController));
router.get('/:id/related', optionalAuthMiddleware, resourceController.getRelatedResources.bind(resourceController));

// Admin / moderator endpoints
router.post(
	'/categories',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	validateDto(createResourceCategoryDto),
	resourceController.createCategory.bind(resourceController),
);
router.patch(
	'/categories/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	validateDto(updateResourceCategoryDto),
	resourceController.updateCategory.bind(resourceController),
);
router.delete(
	'/categories/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	resourceController.deleteCategory.bind(resourceController),
);

router.post(
	'/',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	validateDto(createResourceDto),
	resourceController.createResource.bind(resourceController),
);
router.patch(
	'/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	validateDto(updateResourceDto),
	resourceController.updateResource.bind(resourceController),
);
router.delete(
	'/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	resourceController.deleteResource.bind(resourceController),
);

router.post(
	'/:id/related',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	validateDto(createRelatedResourceDto),
	resourceController.addRelatedResource.bind(resourceController),
);
router.delete(
	'/related/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	resourceController.deleteRelatedResource.bind(resourceController),
);

// Authenticated endpoints
router.post(
	'/:id/ratings',
	authMiddleware,
	validateDto(rateResourceDto),
	resourceController.rateResource.bind(resourceController),
);

export default router;
