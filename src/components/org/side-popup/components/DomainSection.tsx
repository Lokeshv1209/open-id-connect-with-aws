"use client";

import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Control, Controller, FieldArrayWithId, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

import Globe from "@/../public/Globe.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { IColumns } from "../../Org";

interface DomainSectionProps {
  control: Control<IColumns>;
  errors: FieldErrors<IColumns>;
  fields: FieldArrayWithId<IColumns, "orgDomain", "id">[];
  append: UseFieldArrayAppend<IColumns, "orgDomain">;
  remove: UseFieldArrayRemove;
}

export const DomainSection = React.memo(({
  control,
  errors,
  fields,
  append,
  remove,
}: DomainSectionProps) => {
  return (
    <div className="">
      <div className="flex justify-between">
        <Label
          htmlFor="domain"
          className="text-xs 2xl:text-sm font-medium text-[#253B35]"
        >
          Domain
        </Label>
        <Button
          variant="ghost"
          onClick={() => append({ value: "", edit: true })}
          disabled={fields?.length >= 2}
          className="text-[#0F712D]"
        >
          <div className="flex gap-1">
            <Plus />
            <span>Add</span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {fields?.map((domain, key) => (
          <div key={domain?.id}>
            <div className="flex gap-2">
              <div className="flex w-full h-[3rem] border items-center gap-2 border-gray-200 py-1.5 px-2 rounded-md bg-[#F6F6F666]">
                <Image src={Globe} alt="" className="" />
                <Controller
                  name={`orgDomain.${key}.value`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="domain"
                      type="text"
                      placeholder="Enter domain name"
                      value={field.value}
                      onChange={field.onChange}
                      className="p-0 w-full text-xs 2xl:text-sm border-none outline-none"
                      disabled={!domain?.edit}
                    />
                  )}
                />
              </div>
              {key >= 1 && (
                <Button
                  onClick={() => remove(key)}
                  variant="noOutline"
                  size="icon"
                  disabled={!domain?.edit}
                  className="bg-[#E9221514] h-[3rem] shadow-lg rounded-md"
                >
                  <Trash2 className="text-[#FF6B6B]" />
                </Button>
              )}
            </div>
            {errors.orgDomain?.[key]?.value && (
              <p className="text-red-400 text-xs">
                {errors.orgDomain[key].value.message}
              </p>
            )}
          </div>
        ))}
      </div>
      {errors.orgDomain && (
        <p className="text-red-400 text-xs">{errors.orgDomain.message}</p>
      )}
    </div>
  );
});

DomainSection.displayName = "DomainSection";