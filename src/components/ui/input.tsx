import * as React from "react";

import { cn } from "@/lib/utils";

type IInputProps = React.ComponentProps<"input"> & {
  label?: string;
};

const InputComponent = React.memo(function Input({
  className,
  label,
  type,
  ...props
}: IInputProps) {
  return (
    <div className="flex-1">
      {label && <label className="text-sm">{label}</label>}
      <input
        type={type}
        data-slot="input"
        className={cn(
          " border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          // " focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
    </div>
  );
});

InputComponent.displayName = "Input";

export { InputComponent as Input };
