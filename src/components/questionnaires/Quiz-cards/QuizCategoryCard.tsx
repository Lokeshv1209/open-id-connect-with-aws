"use client";
import Image from "next/image";
import React, { useState } from "react";

import { getRandomLightColor } from "@/common/helper";
import { Button } from "@/components/ui/button";

import { NoOFQuiz } from "../../../../public/SvgIcons";
import type { ICategory } from "../Quiz";
import AddQuiz from "../side-popup/AddQuiz";
import ViewQuiz from "../side-popup/ViewQuiz";

interface IProp {
  categoryData: ICategory[];
}

export default function QuizCategoryCard({ categoryData }: IProp) {
  const [openViewQuiz, setOpenViewQuiz] = useState(false);
  const [openCreateQuiz, setOpenCreateQuiz] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {categoryData?.map((categoryData, key) => {
        const randomColor = getRandomLightColor();
        return (
          <div key={key} className="bg-[#FFFFFFE5] rounded-2xl py-5 flex flex-col  gap-2.5 px-4.5">
            <div className="flex gap-3.5 items-center justify-between">
              <div className="">
                <h3 className="text-md font-medium text-[#012815]   truncate">
                  {categoryData?.categoryName}
                </h3>
                <p className="text-sm font-normal text-[#615F5FE5]   break-all line-clamp-2">
                  {categoryData?.description}
                </p>
                <div className="flex gap-1.25">
                  <NoOFQuiz />
                  <p className="text-[#FD8F1E]">{categoryData?.questionCount} Questions</p>
                </div>
              </div>
              <div
                className="flex-shrink-0 w-[4rem] h-[4rem] 2xl:w-[100px] 2xl:h-[6.25rem] flex items-center justify-center rounded-full p-3 overflow-hidden relative"
                style={{ backgroundColor: randomColor }}
              >
                {categoryData?.iconUrl &&
                categoryData.iconUrl !== "" &&
                categoryData.iconUrl?.includes(".com") ? (
                  <Image
                    src={categoryData.iconUrl}
                    alt={categoryData?.categoryName}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className=" flex justify-center items-center">
                    {categoryData?.categoryName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="gradientGreen"
              className="text-md w-full"
              onClick={() => {
                setSelectedCategory(categoryData);
                if (Number(categoryData?.questionCount)) {
                  setOpenViewQuiz(true);
                } else {
                  setOpenCreateQuiz(true);
                }
              }}
            >
              Explore Questions
            </Button>
          </div>
        );
      })}
      {openViewQuiz && selectedCategory?.questionCount && (
        <ViewQuiz
          handleClose={() => setOpenViewQuiz(false)}
          openEditQuiz={() => setOpenCreateQuiz(true)}
          categoryData={selectedCategory}
        />
      )}
      {openCreateQuiz && selectedCategory && (
        <AddQuiz categoryData={selectedCategory} handleClose={() => setOpenCreateQuiz(false)} />
      )}
    </div>
  );
}
