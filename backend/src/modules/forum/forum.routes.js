import { Router } from 'express';
import { ForumController } from './forum.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';
import { roleMiddleware } from '../../common/middlewares/role.middleware.js';
import { validateDto } from '../../common/middlewares/validation.middleware.js';
import { createCategoryDto, updateCategoryDto } from './dtos/create-category.dto.js';
import { createThreadDto, updateThreadDto } from './dtos/create-thread.dto.js';
import { createPostDto, updatePostDto } from './dtos/create-post.dto.js';
import { createForumReportDto, updateForumReportDto } from './dtos/report-post.dto.js';

const router = Router();
const forumController = new ForumController();

router.get('/categories', forumController.getCategories.bind(forumController));
router.get('/categories/:id', forumController.getCategoryById.bind(forumController));
router.post(
	'/categories',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	validateDto(createCategoryDto),
	forumController.createCategory.bind(forumController),
);
router.patch(
	'/categories/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	validateDto(updateCategoryDto),
	forumController.updateCategory.bind(forumController),
);
router.delete(
	'/categories/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	forumController.deleteCategory.bind(forumController),
);

router.get('/threads', forumController.getThreads.bind(forumController));
router.get('/threads/:id', forumController.getThreadById.bind(forumController));
router.post(
	'/threads',
	authMiddleware,
	validateDto(createThreadDto),
	forumController.createThread.bind(forumController),
);
router.patch(
	'/threads/:id',
	authMiddleware,
	validateDto(updateThreadDto),
	forumController.updateThread.bind(forumController),
);
router.delete(
	'/threads/:id',
	authMiddleware,
	forumController.deleteThread.bind(forumController),
);

router.get('/threads/:id/posts', forumController.getPostsByThreadId.bind(forumController));
router.post(
	'/threads/:id/posts',
	authMiddleware,
	validateDto(createPostDto),
	forumController.addPost.bind(forumController),
);
router.post(
	'/threads/:id/reports',
	authMiddleware,
	validateDto(createForumReportDto),
	forumController.reportThread.bind(forumController),
);

router.get('/posts/:id', forumController.getPostById.bind(forumController));
router.patch(
	'/posts/:id',
	authMiddleware,
	validateDto(updatePostDto),
	forumController.updatePost.bind(forumController),
);
router.delete(
	'/posts/:id',
	authMiddleware,
	forumController.deletePost.bind(forumController),
);
router.post(
	'/posts/:id/reports',
	authMiddleware,
	validateDto(createForumReportDto),
	forumController.reportPost.bind(forumController),
);

router.get(
	'/reports',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	forumController.getReports.bind(forumController),
);
router.get(
	'/reports/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	forumController.getReportById.bind(forumController),
);
router.patch(
	'/reports/:id',
	authMiddleware,
	roleMiddleware(['admin', 'moderator']),
	validateDto(updateForumReportDto),
	forumController.updateReport.bind(forumController),
);

export default router;
