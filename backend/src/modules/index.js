import authRoutes from './auth/auth.routes.js';
import applicationRoutes from './application/application.routes.js';
import candidateRoutes from './candidate/candidate.routes.js';
import companyRoutes from './company/company.routes.js';
import reviewRoutes from './review/index.js';
import notificationRoutes from './notification/index.js';
// Pending implementation: vacancy, resource, forum, notification modules
import forumRoutes from './forum/forum.routes.js';
import resourceRoutes from './resource/resource.routes.js';
import adminRoutes from './admin/admin.routes.js';
import vacancyRoutes from './vacancy/vacancy.routes.js';
// Pending implementation: review, notification modules

export function mountRoutes(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/candidates', candidateRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/forum', forumRoutes);
  app.use('/api/resources', resourceRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/vacancies', vacancyRoutes);
}