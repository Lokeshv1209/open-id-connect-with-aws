"use client";
import Image from "next/image";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface IProps {
  label?: string;
  placeHolder: string;
  options: {
    value: string;
    label: string;
  }[];
  className?: string;
  Icon?: any;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function SelectInput({
  label: _label,
  placeHolder,
  options,
  className,
  Icon,
  value,
  onValueChange,
}: IProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={` ${className}`}>
        <div className="pr-10 flex gap-2 items-center">
          {Icon ? <Image src={Icon} className="w-4 h-4" alt="" /> : null}
          <SelectValue placeholder={placeHolder} />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-64">
        <SelectGroup>
          {options?.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
