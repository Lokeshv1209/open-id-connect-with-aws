"use client";

import { Info } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import Building from "@/../public/Building.svg";
import CustomImageUploader from "@/components/shared-component/CustomImageUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RadioButton from "@/components/ui/toggleButton";

import type { IColumns } from "../../Org";

interface OrgFormSectionProps {
  control: Control<IColumns>;
  errors: FieldErrors<IColumns>;
  orgId?: string;
  iconUrl: File | null | string;
  onFileSelect: (file: File | null) => void;
}

export const OrgFormSection = React.memo(({
  control,
  errors,
  orgId,
  iconUrl,
  onFileSelect,
}: OrgFormSectionProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex flex-col gap-2">
        {/* Company Name and Logo */}
        <div className="flex gap-5 max-md:flex-col-reverse max-md:gap-3 max-md:items-start">
          <div className="flex flex-col gap-4 w-full">
            {/* Company Name */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="company"
                className="text-xs 2xl:text-sm font-medium text-[#253B35]"
              >
                Company
              </Label>
              <div className="flex border w-full h-[3rem] items-center gap-2 border-gray-200 py-1.5 px-2 rounded-md bg-[#F6F6F666]">
                <Image src={Building} alt="" className="" />
                <Controller
                  name="orgName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="company"
                      type="text"
                      placeholder="Enter Company name"
                      value={field.value}
                      onChange={field.onChange}
                      className="p-0 text-xs w-full 2xl:text-sm border-none outline-none"
                    />
                  )}
                />
              </div>
              {errors.orgName && (
                <p className="text-red-400 text-xs">{errors.orgName.message}</p>
              )}
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-1 max-md:w-full">
            <div className="flex flex-col gap-2 max-md:items-center">
              <div className="flex justify-between items-center w-full">
                <Label
                  htmlFor="company"
                  className="text-xs 2xl:text-sm font-medium text-[#253B35]"
                >
                  Logo
                </Label>
                <Popover>
                  <PopoverTrigger>
                    <Info className="text-[#8897AE] w-4 h-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent
                    className="bg-[#898787] border-none w-[5rem] text-[9px] px-2 py-1 text-white rounded-md"
                    align="end"
                  >
                    Size: 1080x1080 px, JPG/PNG, Max 2MB
                  </PopoverContent>
                </Popover>
              </div>
              <CustomImageUploader
                allowedFileType={["image/png", "image/jpeg", "image/jpg"]}
                maxFileSizeMB={2}
                image={iconUrl}
                onFileSelect={onFileSelect}
              />
            </div>
          </div>
        </div>

        {/* Organization Status */}
        <div className="">
          <div className="flex items-center gap-2">
            <Label className="text-xs 2xl:text-[13px] font-medium text-[#07070799]">
              Organization Status
            </Label>
            <span className="text-[10px] 2xl:text[12px] text-[#4E4E4E99]">
              (Visible in app)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs 2xl:text-sm text-[#373636] font-medium">
              Is active for all users.
            </span>
            <div className="relative">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioButton
                    value={!!field.value}
                    onChange={field.onChange}
                    disable={!orgId?.length}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

OrgFormSection.displayName = "OrgFormSection";