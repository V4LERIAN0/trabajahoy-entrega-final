/**
 * Parse and validate pagination query parameters
 * @param {Object} req - Express request object
 * @returns {Object} Pagination parameters
 */
export function parsePagination(req) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  return {
    page: Math.max(1, page),
    limit: Math.min(Math.max(1, limit), 100), // Max 100 items per page
  };
}

/**
 * Format paginated response
 * @param {Array} data - Array of items
 * @param {number} total - Total count of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Formatted paginated response
 */
export function formatPaginatedResponse(data, total, page, limit) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
