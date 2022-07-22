const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

function getPagination(query) {
  const page = Math.abs(query.pageNumber) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.pageSize) || DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

function setPaginationHeader(req, count, res) {
  const currentPage = Math.abs(req.query.pageNumber) || DEFAULT_PAGE_NUMBER;
  const pageSize = Math.abs(req.query.pageSize) || DEFAULT_PAGE_SIZE;
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  res.setHeader(
    'Pagination',
    JSON.stringify({
      currentPage,
      pageSize,
      totalCount,
      totalPages,
    })
  );
  // res.set('Content-Type', 'application/json; charset=utf-8');
}

module.exports = {
  getPagination,
  setPaginationHeader,
};
