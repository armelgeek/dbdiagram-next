export const createPagination = (
  count: number,
  currentPage: number,
  itemsPerPage: number,
  offset: number,
) => {
  return {
    page: currentPage,
    pageSize: itemsPerPage,
    total: Number(count),
    totalPages: Math.ceil(count / itemsPerPage),
    hasNextPage: offset + itemsPerPage < count,
    hasPreviousPage: currentPage > 1,
  };
};
