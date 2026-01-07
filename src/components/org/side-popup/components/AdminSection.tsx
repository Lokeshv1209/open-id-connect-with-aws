"use client";

import { Info } from "lucide-react";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { IColumns } from "../../Org";

interface AdminSectionProps {
  control: Control<IColumns>;
  errors: FieldErrors<IColumns>;
}

export const AdminSection = React.memo(({ control, errors }: AdminSectionProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between pb-3">
        <h2 className="text-md font-medium text-[#455468]">Assigned Admins</h2>
        <Popover>
          <PopoverTrigger>
            <Info className="text-[#8897AE] w-4 h-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent
            className="bg-[#898787] border-none w-[10.5rem] text-[9px] px-2 py-1 text-white rounded-md"
            align="end"
          >
            Invitation will be sent after the organization is saved.
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full bg-[#00B19305] rounded-2xl flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs 2xl:text-sm font-medium text-[#253B35]">
            Full Name
          </Label>
          <Controller
            name="adminName"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Enter Admin Full Name"
                label=""
                value={field.value}
                onChange={field.onChange}
                className="text-xs h-[3rem] font-normal"
              />
            )}
          />
          {errors.adminName && (
            <p className="text-red-400 text-xs">{errors.adminName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs 2xl:text-sm font-medium text-[#253B35]">
            Email
          </Label>
          <Controller
            name="adminEmail"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Enter Admin Email Address"
                value={field.value}
                onChange={field.onChange}
                className="text-xs h-[3rem] font-normal"
              />
            )}
          />
          {errors.adminEmail && (
            <p className="text-red-400 text-xs">{errors.adminEmail.message}</p>
          )}
        </div>
      </div>
    </div>
  );
});

AdminSection.displayName = "AdminSection";