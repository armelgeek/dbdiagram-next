export const calculatePagination = (page: number | undefined, pageSize: number | undefined) => {
  const currentPage = Math.max(1, page || 1);
  const itemsPerPage = Math.min(50, Math.max(1, pageSize || 10));
  const offset = (currentPage - 1) * itemsPerPage;

  return { currentPage, itemsPerPage, offset };
};
