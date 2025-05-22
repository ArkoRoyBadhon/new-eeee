"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PaginationFooter({
  totalItems = 0,
  itemsPerPage = 20,
  currentPage = 1,
  onPageChange,
  className = "",
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    // if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(1)}
          className={cn(
            "h-8 w-8",
            currentPage === 1 && "bg-[#DFB547] text-white hover:bg-amber-600"
          )}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="flex items-center px-2">
            ...
          </span>
        );
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 && startPage > 1) continue; // Skip if we already added first page
      pages.push(
        <Button
          key={i}
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(i)}
          className={cn(
            "h-8 w-8",
            currentPage === i && "bg-[#DFB547] text-white hover:bg-amber-600"
          )}
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="flex items-center px-2">
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key={totalPages}
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className={cn(
            "h-8 w-8",
            currentPage === totalPages &&
              "bg-[#DFB547] text-white hover:bg-amber-600"
          )}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  // if (totalItems <= itemsPerPage) {
  //   return null; // Don't render pagination if there's only one page
  // }

  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row justify-between items-center py-4 border-t px-4",
        className
      )}
    >
      <div className="text-sm text-gray-600 mb-4 sm:mb-0">
        Showing{" "}
        <span className="font-medium">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderPageNumbers()}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
