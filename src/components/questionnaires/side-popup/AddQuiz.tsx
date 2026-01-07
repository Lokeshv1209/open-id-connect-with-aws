"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { RightSideCardBase } from "@/components/shared-component/RightSideCardBase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { quizSchema } from "@/lib/validation/quizSchema";
import { useCreateQuizMutation } from "@/services/api-service/QuizService";

import type { ICategory } from "../Quiz";
import type { IQuestion } from "./ViewQuiz";

export interface IProp {
  handleClose: () => void;
  categoryData: ICategory;
}

type IQuiz = {
  questions: {
    question: string;
    options: { value: string }[];
  }[];
};

export default function AddQuiz({ handleClose, categoryData }: IProp) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IQuiz>({
    defaultValues: {
      questions: [],
    },
    resolver: yupResolver(quizSchema),
  });

  const [createQuiz, { isLoading: createLoading }] = useCreateQuizMutation();

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data: IQuiz) => {
    try {
      if (!data?.questions?.length) {
        showErrorToast("Question should not be empty");
        return;
      }

      if (categoryData?.categoryId) {
        const payload = {
          categoryId: categoryData?.categoryId,
          questions: data?.questions,
        };

        const response = await createQuiz(payload);

        if (response?.data?.code == 201) {
          showSuccessToast("Organization Updated Successfully");
          handleClose();
        } else if (response?.error && "data" in response.error) {
          const errorData = response.error.data as any;
          if (errorData?.statusCode == 400) {
            showErrorToast(errorData?.message || "Bad Request");
          }
        }
      } else {
        showErrorToast("Category Id Missing");
        handleClose();
      }
    } catch (err) {
      showErrorToast("Organization not Added");
      console.error("Error adding organization:", err);
    }
  };

  return (
    <RightSideCardBase
      parentClassName=" grid max-lg:grid-cols-[0.1fr_2fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_0.75fr]"
      heading={Number(categoryData?.questionCount) ? "Edit Questionnaires" : "Add Questionnaires"}
      handleClose={() => handleClose()}
      buttons={[
        {
          label: "Cancel",
          onChange: () => {
            reset();
            handleClose();
          },
          variant: "gradientGray",
        },
        {
          label: "Save",
          variant: "gradientGreen",
          type: "submit",
          form: "addQuiz",
          isLoading: createLoading, // || updateLoading,
        },
      ]}
    >
      <div className="p-5 grid grid-cols-1 lg:grid-cols-[2fr] gap-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm border  border-gray-100 ">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5" id="addQuiz">
            <div className="flex justify-between items-center ">
              <div>
                <h1 className="font-medium text-md text-[#455468]">Category</h1>
                <p>Open Minded</p>
              </div>
              <p className="text-[#1EB54C] w-8 h-8 flex justify-center items-center  text-xs border border-[#1EB54C] rounded-full p-1">
                {questionFields.length}
              </p>
            </div>
            <div className="p-4 bg-[#F2F2F2] h-[69vh] overflow-auto flex flex-col gap-4 rounded-2xl relative">
              {questionFields?.length ? (
                questionFields?.map((question, qIndex) => {
                  return (
                    <QuestionComp
                      key={question?.id}
                      control={control}
                      qIndex={qIndex}
                      removeQuestion={removeQuestion}
                      fieldError={errors}
                    />
                  );
                })
              ) : (
                <div className="text-[#064738] text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <h1 className="text-md font-semibold">Start building your questionnaire !</h1>
                  <p className="text-sm font-normal">
                    Create engaging questions using our card-based builder. Add your first question
                    to get started.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                className="text-md font-medium "
                variant="gradientGreen"
                onClick={() =>
                  appendQuestion({ question: "", options: [{ value: "" }, { value: "" }] })
                }
              >
                <div className="flex items-center gap-1">
                  <Plus />
                  <span>Add Questions</span>
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Loader loading={false} />
    </RightSideCardBase>
  );
}

interface IQuestionCompProps {
  control: Control<IQuiz>;
  qIndex: number;
  question?: IQuestion;
  removeQuestion: (index: number) => void;
  fieldError?: FieldErrors<IQuiz>;
}

export const QuestionComp = ({
  control,
  qIndex,
  removeQuestion,
  fieldError,
}: IQuestionCompProps) => {
  const {
    fields: optionFields,
    append: addOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${qIndex}.options`,
  });
  const [openQuestion, setOpenQuestion] = useState(true);

  return (
    <div className="p-3 bg-[#FFFFFF] w-full flex flex-col gap-5 rounded-2xl" key={qIndex}>
      <div className="flex items-center gap-3.5">
        <div className=" flex justify-center rounded-xl items-center text-[#064738] font-semibold text-md bg-[#FACD17] w-[7rem] h-[5rem]">
          {String(qIndex + 1).padStart(2, "0")}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1>Question</h1>
          <div>
            <Controller
              name={`questions.${qIndex}.question`}
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    className="font-medium text-md text-[#04241C] bg-[#FFFFFF] py-3 h-[44px] px-3.5 w-full"
                    placeholder="Click to Enter Question here.."
                    value={field?.value}
                    onChange={field?.onChange}
                  />
                );
              }}
            />
            {fieldError?.questions?.[qIndex]?.question && (
              <p className="text-red-500">{fieldError.questions[qIndex].question?.message}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3.25">
          <Button
            type="button"
            onClick={() => {
              removeQuestion(qIndex);
            }}
            variant="noOutline"
            size="icon"
            className="  bg-[#E9221514] shadow-lg  rounded-md"
          >
            <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
          </Button>
          <Button
            type="button"
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
          <Button
            type="button"
            variant="ghost"
            className="text-[#0AB27B]"
            onClick={() => addOption({ value: "" })}
            disabled={optionFields?.length >= 4}
          >
            <div className="flex items-center gap-1">
              <Plus />
              <span>Add Options</span>
            </div>
          </Button>
        </div>
        {optionFields?.map((option, oIndex) => {
          return (
            <div key={option?.id}>
              <div className="flex gap-2">
                <Controller
                  name={`questions.${qIndex}.options.${oIndex}.value`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        className=" font-medium text-md py-3 h-[44px] px-3.5 w-full text-[#04241C] bg-[#FFFFFF]"
                        placeholder="Click to Enter Options here.."
                        value={field?.value}
                        onChange={field?.onChange}
                      />
                    );
                  }}
                />
                {oIndex >= 2 && (
                  <Button
                    type="button"
                    onClick={() => {
                      removeOption(oIndex);
                    }}
                    variant="noOutline"
                    size="icon"
                    className="  bg-[#E9221514] h-[44px] shadow-lg  rounded-md "
                  >
                    <Trash2 className=" text-[#FF6B6B]" />
                  </Button>
                )}
              </div>
              {fieldError?.questions?.[qIndex]?.options?.[oIndex]?.value && (
                <p className="text-red-500">
                  {fieldError.questions[qIndex].options[oIndex].value?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
