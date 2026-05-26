import { logger } from "../utils/logger.js";

/**
 * Global error handling middleware
 * Standardizes error responses to match the response interceptor format:
 * {
 *   status: "error",
 *   message: "...",
 *   data: null,
 *   timestamp: "ISO-8601"
 * }
 */
export const errorMiddleware = (err, req, res, next) => {
  // Log the error
  logger.error(err.message, {
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    code: err.code,
    statusCode: err.statusCode,
  });

  // Default error response
  let statusCode = err.statusCode || 500;

  // Map common database and validation errors when no statusCode is provided
  if (!err.statusCode) {
    if (err.code === "23505") {
      statusCode = 409;
    } else if (err.code === "23503") {
      statusCode = 409;
    } else if (err.name === "ZodError") {
      statusCode = 400;
    }
  }

  const message = err.message || "Internal Server Error";

  // Don't expose internal errors in production
  const errorDetails =
    process.env.NODE_ENV === "development"
      ? {
          stack: err.stack,
        }
      : {};

  // Match response interceptor format: { status, data, message, timestamp }
  res.status(statusCode).json({
    status: 'error',
    message,
    data: errorDetails,
    timestamp: new Date().toISOString(),
  });
};
