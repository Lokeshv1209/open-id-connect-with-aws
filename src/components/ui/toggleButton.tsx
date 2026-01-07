"use client";
import { Check, X } from "lucide-react";
import React from "react";

interface ToggleWithIconsProps {
  label?: string;
  value: boolean | number;
  onChange?: (_value: boolean | number) => void;
  disable?: boolean;
}

export default function ToggleButton({
  label,
  value,
  onChange,
  disable = false,
}: ToggleWithIconsProps) {
  return (
    <div className="flex items-center justify-between">
      <span className=" text-sm font-normal">{label}</span>
      <div
        className={`
          relative inline-flex h-6 w-10 items-center rounded-full  transition-all duration-300 ease-in-out
          ${value ? "bg-[#1EB54C]" : "bg-[#E9EFF6]"} ${disable ? "cursor-not-allowed" : "cursor-pointer"} shadow-inner
        `}
        onClick={() =>
          !disable &&
          onChange &&
          onChange(typeof value === "number" ? (value === 0 ? 1 : 0) : !value)
        }
      >
        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <X
            className={`w-2 h-2 transition-opacity duration-300 ${
              value ? "text-gray-200 opacity-90" : "text-gray-600 opacity-0"
            }`}
          />
          <Check
            className={`w-2 h-2 transition-opacity duration-300 ${
              value ? "text-gray-600 opacity-0" : "text-gray-400 opacity-80"
            }`}
          />
        </div>

        {/* Toggle Handle */}
        <div
          className={`
            relative h-4 w-4 rounded-full shadow-lg transition-all duration-300 ease-in-out z-10
            ${value ? "translate-x-5 bg-white" : "translate-x-1 bg-[#BFBEBE]"}
          `}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {value ? (
              <Check className="w-2 h-2 text-black" />
            ) : (
              <X className="w-2 h-2 text-[#5B5B5B]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
