"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage = 10,
  totalItems = 0,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [5, 10, 25, 50, 100],
  blogHidden,
  showTotalInfo = true,
  className = "",
  variant = "default",
}) => {
  if (totalPages <= 1 && !showItemsPerPage) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const delta = variant === "compact" ? 1 : 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const goToFirstPage = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 ${className}`}
    >
      {/* Total Items Info */}
      {showTotalInfo && totalItems > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {startItem} to {endItem} of {totalItems} items
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-row items-center gap-2">
        {/* First Page Button */}
        {variant !== "minimal" && (
          <Button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            title="First Page"
          >
            <ChevronsLeft size={16} />
          </Button>
        )}

        {/* Previous Page Button */}
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
          {variant !== "compact" && <span className="ml-1 ">Previous</span>}
        </Button>

        {/* Page Numbers */}
        {variant !== "minimal" && (
          <div className="flex gap-1">
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                onClick={() => typeof page === "number" && onPageChange(page)}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={`w-10 ${
                  currentPage === page
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : ""
                } ${typeof page !== "number" ? "cursor-default" : ""}`}
                disabled={typeof page !== "number"}
              >
                {page}
              </Button>
            ))}
          </div>
        )}

        {/* Next Page Button */}
        <Button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Page"
        >
          {variant !== "compact" && <span className="mr-1">Next</span>}
          <ChevronRight size={16} />
        </Button>

        {/* Last Page Button */}
        {variant !== "minimal" && (
          <Button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            title="Last Page"
          >
            <ChevronsRight size={16} />
          </Button>
        )}
      </div>

      {/* Items Per Page Selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className={`flex items-center gap-2 ${blogHidden}`}>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Show:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
            }}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
