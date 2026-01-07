"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { Button } from "../ui/button";

export interface IProps {
  totalItems: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
  pageLimit?: number;
}

const PaginationComponent = React.memo(function Pagination({
  totalItems,
  setCurrentPage,
  currentPage,
  pageLimit,
}: IProps) {
  const itemsPerPage = pageLimit || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = (currentPage - 1) * itemsPerPage;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="px-4 flex items-center gap-2.5">
      <div className="text-[#455468] flex gap-2 items-center text-xs font-medium">
        <span>{String(startItem).padStart(2, "0")} - </span>
        <span>
          {String(endItem).padStart(2, "0")} of{"  "}
        </span>
        <div className="border-[1px] border-[#1EB54C] rounded-full p-1">
          <p className="text-[#1EB54C] w-5.5 h-5.5 flex justify-center items-center">
            {String(totalItems).padStart(2, "0")}
          </p>
        </div>
      </div>
      <div className="flex ">
        <Button
          variant="ghost"
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className=" w-10 h-10 p-0 text-[#455468] rounded-full  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="" />
        </Button>

        <Button
          variant="ghost"
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className=" w-10 h-10 p-0 text-[#455468] rounded-full  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="" />
        </Button>
      </div>
    </div>
  );
});

PaginationComponent.displayName = "Pagination";

export { PaginationComponent as Pagination };
