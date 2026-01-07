"use client";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { RightSideCardBase } from "@/components/shared-component/RightSideCardBase";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

export interface IProp {
  handleClose: () => void;
}

type IQuiz = {
  question?: string;
  options?: { value: string }[];
};

export default function ViewResponse({ handleClose }: IProp) {
  const [quizList] = useState<IQuiz[]>([
    {
      question: "What is the capital of France?",
      options: [{ value: "Paris" }, { value: "London" }, { value: "Berlin" }, { value: "Madrid" }],
    },
    {
      question: "Which language runs in a web browser?",
      options: [{ value: "Java" }, { value: "C" }, { value: "Python" }, { value: "JavaScript" }],
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: [{ value: "Earth" }, { value: "Mars" }, { value: "Jupiter" }, { value: "Venus" }],
    },
  ]);

  return (
    <RightSideCardBase
      parentClassName=" grid max-lg:grid-cols-[0.1fr_2fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_0.75fr]"
      heading="View Response"
      handleClose={() => handleClose()}
      buttons={
        [
          {
            label: "Close",
            onChange: () => {
              handleClose();
            },
            variant: "gradientGray",
          },
          // !viewResponseFlag && {
          //   label: "Edit Questionnaires",
          //   variant: "gradientGreen",
          //   onClick: () => {
          //     openEditQuiz();
          //     handleClose();
          //   },
          // },
        ].filter(Boolean) as ButtonProps[]
      }
    >
      <div className="p-5 grid grid-cols-1 lg:grid-cols-[2fr] gap-5">
        {/* <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ">ttes</div> */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border flex flex-col gap-3.5  border-gray-100 ">
          <div className="flex justify-between items-center ">
            <div>
              <h1 className="font-medium text-md text-[#455468]">Category</h1>
              <p>Open Minded</p>
            </div>
            <p className="text-[#1EB54C] w-8 h-8 flex justify-center items-center  text-xs border border-[#1EB54C] rounded-full p-1">
              {quizList.length}
            </p>
          </div>
          <div className="p-4 bg-[#F2F2F2] h-[69vh] overflow-auto flex flex-col gap-4 rounded-2xl relative">
            {quizList?.length ? (
              quizList?.map((question, qIndex) => {
                return <QuestionComp key={qIndex} qIndex={qIndex} question={question} />;
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
    </RightSideCardBase>
  );
}

export interface IQuizComp {
  qIndex: number;
  question: IQuiz;
}

export const QuestionComp = ({ qIndex, question }: IQuizComp) => {
  const [openQuestion, setOpenQuestion] = useState(false);

  return (
    <div className="p-3 bg-[#FFFFFF] w-full flex flex-col gap-5 rounded-2xl" key={qIndex}>
      <div className="flex items-center gap-3.5">
        <div className=" flex justify-center rounded-xl items-center text-[#064738] font-semibold text-md bg-[#FACD17] w-[7rem] h-[5rem]">
          {String(qIndex + 1).padStart(2, "0")}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1>Question</h1>
          <p className="font-medium text-md text-[#064738]">{question?.question}</p>
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
        {question?.options?.map((option, oIndex) => {
          return (
            <div key={oIndex} className="py-4 px-5 bg-[#FFFFFF] flex flex-col gap-2.5 rounded-xl">
              <p className="font-medium text-sm  text-[#000000]">{option?.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
