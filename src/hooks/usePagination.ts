import { useCallback, useMemo, useState } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  pageRange: number[];
  startIndex: number;
  endIndex: number;
}

/**
 * Custom hook for pagination logic
 * @param totalItems - Total number of items
 * @param itemsPerPage - Number of items per page
 * @param initialPage - Initial page number (default: 1)
 * @returns Pagination controls and state
 */
export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Generate page range for pagination UI
  const pageRange = useMemo(() => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: number[] = [];
    let l: number;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1); // -1 represents dots
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    isFirstPage,
    isLastPage,
    pageRange,
    startIndex,
    endIndex,
  };
}
