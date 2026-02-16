"use client";
import Image from "next/image";
import type React from "react";

import LoginDesign1 from "@/../public/LoginDesign1.svg";
import LoginDesign2 from "@/../public/LoginDesign2.svg";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-blue-800">
      <main className=" ">{children}</main>
      <Image className="absolute top-0 left-0 w-36" src={LoginDesign1} alt="" />
      <Image className="absolute left-0 bottom-2 w-36" src={LoginDesign2} alt="" />
      <Image className="absolute bottom-3 right-3 w-24" src={LoginDesign1} alt="" />
      <Image className="absolute top-0 right-2 w-24" src={LoginDesign2} alt="" />
      <div className="absolute -top-[25%] -left-[15%] w-[500px] h-[500px] bg-gradient-to-b from-[#FFFFFF80] to-[#FFFFFF00] rounded-full"></div>
      <div className="absolute -bottom-[25%] -right-[10%] rotate-[118deg] w-[500px] h-[500px] bg-gradient-to-b from-[#FFFFFF50] to-[#FFFFFF00] rounded-full"></div>
    </div>
  );
}
