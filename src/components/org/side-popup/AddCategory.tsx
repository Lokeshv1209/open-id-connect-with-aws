"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Info } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import CustomImageUploader from "@/components/shared-component/CustomImageUploader";
import { RightSideCardBase } from "@/components/shared-component/RightSideCardBase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RadioButton from "@/components/ui/toggleButton";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { createCategorySchema } from "@/lib/validation/createCategorySchema";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/services/api-service/CategoryService";

import type { ICategory } from "../org-cards/CategoryCards";

interface ICategoryForm {
  categoryName: string;
  description?: string;
  status: number;
  iconUrl?: string | File | null;
}

interface IProps {
  categoryInfo?: ICategory;
  handleClose: (value: boolean) => void;
}

export default function AddCategory({ categoryInfo, handleClose }: IProps) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ICategoryForm>({
    resolver: yupResolver(createCategorySchema) as any,
    defaultValues: {
      categoryName: "",
      description: "",
      status: 1,
      iconUrl: null,
    },
  });

  const [createCategory, { isLoading: createLoading }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updateLoading }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (categoryInfo) {
      reset({
        categoryName: categoryInfo?.categoryName,
        description: categoryInfo?.description,
        iconUrl: categoryInfo?.iconUrl,
        status: categoryInfo?.status,
      });
    }
  }, [categoryInfo, reset]);

  const onSubmit = async (categoryForm: ICategoryForm) => {
    const formData = new FormData();
    formData.append("categoryName", categoryForm?.categoryName);
    formData.append("description", categoryForm?.description || "");
    formData.append("status", categoryForm?.status.toString());
    if (categoryForm?.iconUrl) {
      formData.append("iconUrl", categoryForm?.iconUrl);
    }

    const isUpdate = Boolean(categoryInfo);
    if (isUpdate) {
      formData.append("categoryId", categoryInfo?.categoryId as string);
    }

    try {
      const response = await (
        isUpdate ? updateCategory(formData) : createCategory(formData)
      ).unwrap();

      if (response?.code === 201) {
        showSuccessToast(
          "Saved Successfully!",
          `The category has been ${isUpdate ? "updated" : "added"}.`
        );
        handleClose(false);
      }
    } catch (err) {
      showErrorToast(
        "Something Error!",
        `The category has not been ${isUpdate ? "updated" : "added"}.`
      );
      console.error(`Error ${isUpdate ? "updating" : "creating"} category:`, err);
    }
  };

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setValue("iconUrl", file);
    }
  };

  return (
    <RightSideCardBase
      handleClose={() => handleClose(false)}
      parentClassName="grid max-lg:grid-cols-[0.1fr_2fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[2fr_0.87fr]"
      heading={categoryInfo ? "Edit Category" : "Add Category"}
      buttons={[
        {
          label: "Cancel",
          onChange: () => handleClose(false),
          variant: "gradientGray",
        },
        {
          label: "Save",
          variant: "gradientGreen",
          type: "submit",
          form: "categoryForm",
          isLoading: updateLoading || createLoading,
        },
      ]}
    >
      <div className="p-5">
        <div className="p-4 bg-white rounded-2xl shadow-[0_5px_15px_0_rgba(0,0,0,0.15)]">
          <form id="categoryForm" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex justify-between max-md:flex-col-reverse gap-5">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-xs font-medium text-[#253B35]">
                    Category Name
                  </Label>
                  <Controller
                    name="categoryName"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter category name"
                        className="text-xs h-[3rem]"
                      />
                    )}
                  />
                </div>
                {errors.categoryName && (
                  <span className="text-red-500 text-xs">{errors.categoryName.message}</span>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="description" className="text-xs font-medium text-[#253B35]">
                    Description
                  </Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Enter a short description"
                        className="min-h-[6.8rem] w-full px-3 py-2 text-xs border outline-none rounded-lg resize-none  "
                      />
                    )}
                  />
                </div>
              </div>
              <div className=" flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Label className="text-center text-xs text-[#253B35] font-medium ">
                    Category Preview
                  </Label>
                  <Popover>
                    <PopoverTrigger>
                      <Info className="text-[#8897AE] w-4 h-4 cursor-pointer" />
                    </PopoverTrigger>
                    {/* Tooltip */}
                    <PopoverContent
                      className="bg-[#898787] border-none w-[5rem] text-[9px] px-2 py-1  text-white  rounded-md "
                      align="end"
                    >
                      Size: 1080x1080 px, PNG, Max 2MB
                    </PopoverContent>
                  </Popover>
                </div>
                <CustomImageUploader
                  image={watch("iconUrl")}
                  allowedFileType={["image/png"]}
                  maxFileSizeMB={2}
                  onFileSelect={handleFileSelect}
                />
              </div>
            </div>

            {/* Status */}
            <div className="">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1">
                    <Label className="text-xs font-medium text-[#07070799]">
                      Categories Status
                    </Label>
                    <span className="text-[10px] text-[#4E4E4E99]">(Visible in app)</span>
                  </div>
                  <p className="text-xs text-[#373636] font-medium">Is active to create a post.</p>
                </div>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <RadioButton value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
              {errors.status && (
                <span className="text-red-500 text-xs">{errors.status.message}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </RightSideCardBase>
  );
}
