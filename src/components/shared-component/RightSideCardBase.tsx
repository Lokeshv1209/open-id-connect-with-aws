"use client";

import { X } from "lucide-react";
import React from "react";

import type { ButtonProps } from "../ui/button";
import { Button } from "../ui/button";

export interface IProp {
  children: React.ReactNode;
  handleClose: (value: boolean) => void;
  className?: string;
  parentClassName?: string;
  heading: string;
  buttons?: ButtonProps[];
}

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function RightSideCardBase({
  children,
  handleClose,
  className,
  parentClassName,
  heading,
  buttons,
}: IProp) {
  return (
    <Dialog open={true}>
      <form>
        <DialogContent className="sm:max-w-full top-[3%] bg-transparent border-0">
          <DialogTitle />
          <div
            className={`w-full h-screen backdrop-blur-xs  pl-2 absolute  right-0 top-0 ${parentClassName}`}
          >
            <div className="relative  my-5">
              <Button
                className=" absolute right-0 top-0 py-5 w-9 2xl:w-[54px] 2xl:h-[53px] bg-[#FFFFFF66] text-black backdrop-blur-2xl rounded-l-full rounded-r-none"
                onClick={() => handleClose(false)}
                variant="noOutline"
              >
                <div className="border p-0.5 w-6 h-6 2xl:w-10 2xl:h-10 flex justify-center items-center rounded-full bg-white">
                  <X />
                </div>
              </Button>
            </div>
            <div
              className={` my-5 mr-5 rounded-r-3xl rounded-b-3xl relative ${className} `}
              style={{ overflow: "hidden" }}
            >
              <div className="bg-[#FFFFFF] h-full overflow-auto flex flex-col">
                <div className="flex flex-col">
                  <h1 className="text-xl px-5 py-1.5 2xl:px-[20px] 2xl:py-[14px] flex  items-center 2xl:h-[51px] font-medium text-[#064738]">
                    {heading}
                  </h1>
                  <hr className="w-full h-[1px] bg-gradient-to-r from-[#064738] to-[#FFFFFF] border-0" />
                </div>
                <div className="bg-[#EAEAEA] w-full h-[80vh] 2xl:h-[86.5vh] overflow-auto">
                  {children}
                </div>
                {buttons && (
                  <div className="py-2 px-4 flex gap-3 justify-end">
                    {buttons?.map((button, key) => {
                      const { variant, onChange, label, children, ...rest } = button;
                      return (
                        <Button
                          variant={variant}
                          key={key}
                          onClick={onChange}
                          {...rest}
                          className="cursor-pointer"
                        >
                          <div className="flex gap-1 items-center">
                            {children && <div>{children}</div>}
                            <span>{label}</span>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
