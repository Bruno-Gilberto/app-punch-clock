import React from 'react';
import ReactPaginate from 'react-paginate';

const PaginationControls = ({ pageCount, currentPage, onPageChange }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      previousLabel="<"
      renderOnZeroPageCount={null}
      forcePage={currentPage - 1} 
      // Use classes do seu CSS ou UI lib (ex: shadcn/ui classes ou bootstrap/tailwind classes)
      containerClassName={"pagination flex justify-center items-center space-x-2 p-6"}
      pageLinkClassName={"px-3 py-1 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"}
      previousLinkClassName={"px-3 py-1 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"}
      nextLinkClassName={"px-3 py-1 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"}
      activeLinkClassName={"bg-primary text-primary-foreground border-blue-500 hover:bg-blue-600"}
      disabledLinkClassName={"opacity-50 cursor-not-allowed"}
    />
  );
};

export default PaginationControls;