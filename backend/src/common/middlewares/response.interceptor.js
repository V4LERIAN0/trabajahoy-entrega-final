/**
 * Response Interceptor Middleware
 * Standardizes all API responses with a consistent format
 * 
 * Response format:
 * {
 *   status: "success" | "error",
 *   data: { ... },
 *   pagination: { ... },
 *   timestamp: "ISO-8601"
 * }
 */
export const responseInterceptor = (req, res, next) => {
  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method
  res.json = function (body) {
    // If response already has our format, skip
    if (body && body.status !== undefined) {
      return originalJson(body);
    }

    // Determine status based on HTTP status code
    const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
    const status = isSuccess ? 'success' : 'error';

    // Build standardized response
    const formattedResponse = {
      status,
      data: body?.data ?? body ?? null,
      timestamp: new Date().toISOString(),
    };

    // Add pagination if present
    if (body?.pagination) {
      formattedResponse.pagination = body.pagination;
    }

    // Add message if present (for success responses)
    if (body?.message && isSuccess) {
      formattedResponse.message = body.message;
    }

    // For error responses, include message at top level
    if (body?.message && !isSuccess) {
      formattedResponse.message = body.message;
    }

    return originalJson(formattedResponse);
  };

  next();
};
