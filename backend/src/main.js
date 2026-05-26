import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database/data-source.js';
import { mountRoutes } from './modules/index.js';
import { PORT, NODE_ENV, CORS_ORIGIN, CORS_CREDENTIALS } from './common/config/constants.js';
import { errorMiddleware } from './common/middlewares/error.middleware.js';
import { responseInterceptor } from './common/middlewares/response.interceptor.js';
import { setupSwagger } from './common/swagger-docs/swagger.config.js';
import { logger } from './common/utils/logger.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map(origin => origin.trim()),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: CORS_CREDENTIALS,
  maxAge: 600, // Cache preflight request results for 10 minutes
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response interceptor (before logging)
app.use(responseInterceptor);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Mount all routes
mountRoutes(app);

// Setup Swagger (development only)
if (NODE_ENV === 'development') {
  setupSwagger(app);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
AppDataSource.initialize()
  .then(() => {
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`********************************************************`);
      console.log(`******  SERVER RUNNING ON: http://localhost:${PORT}  ******`);
      console.log(`****  API SWAGGER ON: http://localhost:${PORT}/api/docs ***`);
      console.log(`********************************************************`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Database: Connected`);
    });
  })
  .catch((error) => {
    logger.error('Failed to initialize database', { error: error.message });
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await AppDataSource.destroy();
  process.exit(0);
});

export default app;
