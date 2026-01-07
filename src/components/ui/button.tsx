"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    label?: string;
  };

export interface IButtonGroupProp {
  label: string;
  className: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primaryYellow"
    | "primaryYellowRounded"
    | "PrimaryGray"
    | "PrimaryGrayRounded"
    | null;
  handleFunction: () => void;
}

const buttonVariants = cva(
  "inline-flex items-center hover:cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-black shadow-xs text-gray-300  hover:text-accent-foreground  dark:border-input rounded-full text-[11px]",
        noOutline: " bg-black shadow-xs text-gray-300 dark:border-input rounded-full text-[11px]",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "text-[#AEADAD] border-none outline-none",
        link: "text-primary underline-offset-4 hover:underline",
        primaryYellow: "bg-[#f9df0a] text-black text-[11px]",
        primaryYellowRounded: "bg-[#f9df0a] text-black rounded-3xl text-[11px]",
        primaryBlueRounded: "bg-[#1877F2] text-white rounded-3xl text-[11px]",
        PrimaryGray: "bg-gray-100/10 text-gray-300",
        white: " bg-white text-[#022812]",
        gradientGreen:
          " bg-gradient-to-b from-[#00B193] to-[#1EB54C] text-white font-medium text-md",
        gradientGray:
          " bg-gradient-to-b from-[#e0e0e0] to-[#dfdfdf] text-[#064738] font-medium text-md ",
        delete: " bg-gradient-to-b from-[#D22B2B] to-[#DE3163] text-white font-medium text-[11px] ",
        PrimaryGrayRounded: "bg-gray-100/10 text-gray-300 rounded-3xl text-[11px]",
        floating:
          "bg-gradient-to-b from-[#dbdbdb] to-[#f0f0f0] text-[#20623B] rounded-3xl text-[11px]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 max-lg:text-[10px] max-lg:px-2",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const ButtonComponent = React.memo(function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        className,
        disabled || isLoading ? "pointer-events-none opacity-50" : ""
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className="relative">
        <span className={cn(isLoading && "opacity-35")}>{children}</span>
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
        )}
      </div>
    </Comp>
  );
});

ButtonComponent.displayName = "Button";

const ButtonGroupComponent = React.memo(function ButtonGroup(buttonList: IButtonGroupProp[]) {
  return (
    <div className="flex">
      {buttonList?.map((button, index) => {
        const { variant, className, handleFunction, label, ...rest } = button;
        return (
          <ButtonComponent
            variant={variant}
            className={className}
            key={index}
            onClick={handleFunction}
            {...rest}
          >
            {label}
          </ButtonComponent>
        );
      })}
    </div>
  );
});

ButtonGroupComponent.displayName = "ButtonGroup";

export { ButtonComponent as Button, ButtonGroupComponent as ButtonGroup, buttonVariants };
