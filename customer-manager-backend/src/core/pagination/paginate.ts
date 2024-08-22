export const getPagingData = (totalItems: number, page: number, limit: number) => {
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const previusPage = page > 1 ? page - 1 : null;
  
    return { totalPages, currentPage: page, previusPage, nextPage, totalItems };
  };