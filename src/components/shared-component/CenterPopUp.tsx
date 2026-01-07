"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface IProps {
  heading?: string;
  children?: React.ReactNode;
  buttons?: {
    label: string;
    onClick?: () => void;
    className?: string;
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
      | "delete"
      | "gradientGray"
      | "gradientGreen"
      | null;
    isLoading?: boolean;
  }[];
  onClose?: () => void;
}

export function CenterPopUp({ heading, children, buttons, onClose }: IProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className=" font-normal tracking-wide text-[#064738]">{heading}</DialogTitle>
          <Button className="absolute top-2 right-2 h-2 w-2" variant="ghost" onClick={onClose}>
            <X className="" />
          </Button>
        </DialogHeader>
        {children}
        <DialogFooter>
          {buttons?.map((button, key) => {
            return (
              <Button
                key={key}
                onClick={button?.onClick}
                className={button?.className}
                variant={button?.variant}
              >
                {button?.label}
              </Button>
            );
          })}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
