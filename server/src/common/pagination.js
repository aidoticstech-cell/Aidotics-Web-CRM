function parsePagination(query, { maxLimit = 100, defaultLimit = 20 } = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(query.limit) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function paginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

function parseSort(query, allowed, defaultField = "createdAt") {
  const sortBy = allowed.includes(query.sortBy) ? query.sortBy : defaultField;
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  return { [sortBy]: sortOrder };
}

function notDeletedWhere() {
  return { deletedAt: null };
}

module.exports = { parsePagination, paginationMeta, parseSort, notDeletedWhere };
