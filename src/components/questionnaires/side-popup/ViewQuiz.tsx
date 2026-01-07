"use client";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

import { RightSideCardBase } from "@/components/shared-component/RightSideCardBase";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { showErrorToast } from "@/lib/toast";
import { useGetQuestionResponseByIdQuery } from "@/services/api-service/QuizService";

import type { ICategory } from "../Quiz";

export interface IProp {
  handleClose: () => void;
  openEditQuiz: () => void;
  categoryData: ICategory;
}

export interface IOption {
  optionId?: string;
  optionText: string;
  selectedCount?: number;
}

export interface IQuestion {
  questionId?: string;
  questionText: string;
  isActive?: boolean;
  createdAt?: string;
  QuestionOptions: IOption[];
  totalSelected?: number;
}

export default function ViewQuiz({ handleClose, openEditQuiz, categoryData }: IProp) {
  const [viewResponseFlag, setViewResponseFlag] = useState(false);
  const [questions, setQuestions] = useState<IQuestion[]>();

  const {
    data: quizResData,
    error: quizResError,
    isLoading,
  } = useGetQuestionResponseByIdQuery({
    id: categoryData?.categoryId,
  });

  useEffect(() => {
    if (quizResData?.data) {
      console.info("Organization list:", quizResData?.data);
      setQuestions(quizResData?.data);
    }
    if (quizResError) {
      console.info("Error fetching org list:", quizResError);
      showErrorToast("Error While Fetching Organization List");
    }
  }, [quizResData, quizResError]);

  return (
    <RightSideCardBase
      parentClassName=" grid max-lg:grid-cols-[0.1fr_2fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_0.75fr]"
      heading={viewResponseFlag ? "View Response" : "View Questionnaire"}
      handleClose={() => handleClose()}
      buttons={
        [
          questions?.length && {
            label: viewResponseFlag ? "Close Response" : "View Response",
            onChange: () => {
              setViewResponseFlag(!viewResponseFlag);
            },
            variant: "gradientGray",
          },
          !viewResponseFlag && {
            label: "Edit Questionnaires",
            variant: "gradientGreen",
            onClick: () => {
              openEditQuiz();
              handleClose();
            },
          },
        ].filter(Boolean) as ButtonProps[]
      }
    >
      <div className="p-5 grid grid-cols-1 lg:grid-cols-[2fr] gap-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm border flex flex-col gap-3.5  border-gray-100 ">
          <div className="flex justify-between items-center ">
            <div>
              <h1 className="font-medium text-md text-[#455468]">Category</h1>
              <p>{categoryData?.categoryName}</p>
            </div>
            <p className="text-[#1EB54C] w-8 h-8 flex justify-center items-center  text-xs border border-[#1EB54C] rounded-full p-1">
              {questions?.length || 0}
            </p>
          </div>
          <div className="p-4 bg-[#F2F2F2] h-[69vh] overflow-auto flex flex-col gap-4 rounded-2xl relative">
            {questions?.length ? (
              questions?.map((question, qIndex) => {
                return (
                  <QuestionComp
                    key={qIndex}
                    qIndex={qIndex}
                    question={question}
                    viewResponseFlag={viewResponseFlag}
                  />
                );
              })
            ) : (
              <div className="text-[#064738] text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <h1 className="text-md font-semibold">Start building your questionnaire !</h1>
                <p className="text-sm font-normal">
                  Create engaging questions using our card-based builder. Add your first question to
                  get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Loader loading={isLoading} />
    </RightSideCardBase>
  );
}

export interface IQuizComp {
  qIndex: number;
  question: IQuestion;
  viewResponseFlag: boolean;
}

export const QuestionComp = ({ qIndex, question, viewResponseFlag }: IQuizComp) => {
  const [openQuestion, setOpenQuestion] = useState(false);

  return (
    <div
      className="p-3 bg-[#FFFFFF] w-full flex flex-col gap-5 rounded-2xl"
      key={question?.questionId}
    >
      <div className="flex items-center gap-3.5">
        <div className=" flex justify-center rounded-xl items-center text-[#064738] font-semibold text-md bg-[#FACD17] w-[7rem] h-[5rem]">
          {String(qIndex + 1).padStart(2, "0")}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1>Question</h1>
          <p className="font-medium text-md text-[#064738] break-all">{question?.questionText}</p>
        </div>
        <div className="flex gap-3.25">
          <Button
            onClick={() => {
              setOpenQuestion(!openQuestion);
            }}
            variant="floating"
            size="icon"
            className="rounded-md "
          >
            <ChevronDown className={`${openQuestion ? "text-[#20623B]" : "text-[#ABB7B4]"}`} />
          </Button>
        </div>
      </div>
      <div className={`bg-[#00B1930A] flex flex-col gap-3.5 p-5  ${!openQuestion ? "hidden" : ""}`}>
        <div className="flex justify-between">
          <h1>Options</h1>
        </div>
        {question?.QuestionOptions?.map((option) => {
          const optionPercent = question?.totalSelected
            ? (Number(option?.selectedCount || 0) / Number(question.totalSelected)) * 100
            : 0;
          return (
            <div
              key={option?.optionId}
              className="py-4 px-5 bg-[#FFFFFF] flex flex-col gap-2.5 rounded-xl"
            >
              <div className="flex justify-between">
                <p className="font-medium text-sm  text-[#000000] break-all">
                  {option?.optionText}
                </p>
                {viewResponseFlag && (
                  <span>
                    {option?.selectedCount}({optionPercent}%)
                  </span>
                )}
              </div>
              {viewResponseFlag && <Progress value={optionPercent} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
