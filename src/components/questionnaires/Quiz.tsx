"use client";
import React, { useEffect, useState } from "react";

import { useGetQuizCategoryListQuery } from "@/services/api-service/QuizService";

import Loader from "../ui/loader";
import QuizCategoryCard from "./Quiz-cards/QuizCategoryCard";

export interface ICategory {
  categoryId: string;
  categoryName: string;
  iconUrl: string;
  description: string;
  status: number;
  questionCount: string;
}

export default function Quiz() {
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);

  const {
    data: cateGoryList,
    error: cateGoryError,
    isLoading: categoryLoading,
  } = useGetQuizCategoryListQuery(
    {
      // search: NavBarSearch,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (cateGoryError) {
      console.error("Error fetching category list:", cateGoryError);
      setCategoryList([]);
    } else if (cateGoryList?.data?.data) {
      setCategoryList(cateGoryList.data.data);
    }
  }, [cateGoryList, cateGoryError]);

  return (
    <div className="p-6 flex flex-col gap-5 h-[80vh]">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-[#064738] text-xl font-medium">Questionnaires Management</h1>
          <p className="text-[15px] font-normal text-[#606060]">
            Explore Responses and Publish New Questions
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="flex max-md:flex-col max-md:gap-2 items-center justify-between px-5 py-3.5 rounded-t-3xl bg-white">
          <div className="flex gap-2.5 items-center">
            <h1 className="text-[#064738] text-xl font-medium">Category List</h1>
          </div>
        </div>
        <div className="bg-[#FFFFFF99] 2xl:h-[74vh]  rounded-b-3xl">
          {categoryList?.length ? (
            <QuizCategoryCard categoryData={categoryList} />
          ) : (
            <div className="flex flex-col justify-center items-center  h-full">
              <h2 className="text-xl">Oops!</h2>
              <h3 className="text-2xl font-semibold">No Category Found</h3>
            </div>
          )}
        </div>
        <Loader loading={categoryLoading} />
      </div>
    </div>
  );
}
