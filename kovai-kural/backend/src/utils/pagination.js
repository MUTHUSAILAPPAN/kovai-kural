/**
 * Pagination helper
 * @param {Object} query - Mongoose query object
 * @param {Number} page - Page number (default: 1)
 * @param {Number} limit - Items per page (default: 20)
 * @returns {Object} - { docs, totalDocs, totalPages, currentPage, hasNextPage, hasPrevPage }
 */
async function paginate(query, page = 1, limit = 20) {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // max 100 items
  
  const skip = (pageNum - 1) * limitNum;
  
  const [docs, totalDocs] = await Promise.all([
    query.skip(skip).limit(limitNum),
    query.model.countDocuments(query.getFilter())
  ]);
  
  const totalPages = Math.ceil(totalDocs / limitNum);
  
  return {
    docs,
    totalDocs,
    totalPages,
    currentPage: pageNum,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1
  };
}

module.exports = { paginate };
