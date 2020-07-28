export const paginationDataParser = (data: any): any => {
  data.meta.itemsPerPage = +data.meta.itemsPerPage;
  data.meta.currentPage = +data.meta.currentPage;
  return data;
};
