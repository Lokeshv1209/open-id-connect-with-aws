"use client";
import { Check, ChevronDown, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface IProps {
  label?: string;
  placeHolder?: string;
  options: {
    value: string;
    label: string;
  }[];
  className?: string;
  Icon?: any;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  maxSelections?: number;
  showSelectAll?: boolean;
}

export function MultiSelectInput({
  label: _label,
  placeHolder,
  options,
  className,
  Icon,
  value = [],
  onValueChange,
  maxSelections,
  showSelectAll = true,
}: IProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : maxSelections && value.length >= maxSelections
        ? value
        : [...value, optionValue];

    onValueChange?.(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
    onValueChange?.(newValue);
  };

  const handleSelectAll = () => {
    if (value.length === options.length) {
      onValueChange?.([]);
    } else {
      const allValues = maxSelections
        ? options.slice(0, maxSelections).map((option) => option.value)
        : options.map((option) => option.value);
      onValueChange?.(allValues);
    }
  };

  const handleClearAll = () => {
    onValueChange?.([]);
  };

  const getSelectedLabels = () => {
    return value.map((v) => options.find((option) => option.value === v)?.label).filter(Boolean);
  };

  const isAllSelected = value.length === options.length && options.length > 0;

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn(
            "flex justify-between text-left font-normal h-auto min-h-[40px] px-3 py-2 rounded-md",
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {Icon && (
              <Image src={Icon || "/placeholder.svg"} className="w-4 h-4 flex-shrink-0" alt="" />
            )}

            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {value.length === 0 ? (
                <p className="text-xs w-full text-muted-foreground">{placeHolder}</p>
              ) : (
                <>
                  {getSelectedLabels()
                    .slice(0, 2)
                    .map((label, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-0 h-5 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        <button
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          onClick={(e) => {
                            const optionValue = value[index];
                            if (optionValue) handleRemove(optionValue, e);
                          }}
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </Badge>
                    ))}
                  {value.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5 bg-gray-100 text-gray-700"
                    >
                      +{value.length - 2} more
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2 border-b">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {showSelectAll && options.length > 1 && (
          <div className="p-2 border-b">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs h-7 px-2"
              >
                {isAllSelected ? "Deselect All" : "Select All"}
              </Button>
              {value.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs h-7 px-2 text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="max-h-64 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No options found</div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = value.includes(option.value);
              const isDisabled = maxSelections && !isSelected && value.length >= maxSelections;

              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-100/10 text-sm",
                    isSelected && "bg-gray-100/10",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !isDisabled && handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 border rounded flex items-center justify-center",
                      isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={cn("flex-1", isSelected && "font-medium")}>{option.label}</span>
                </div>
              );
            })
          )}
        </div>

        {maxSelections && (
          <div className="p-2 border-t bg-gray-50">
            <div className="text-xs text-gray-600 text-center">
              {value.length} of {maxSelections} selected
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
