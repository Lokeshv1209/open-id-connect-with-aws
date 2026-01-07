"use client";
import type React from "react";

import { SideBar } from "@/components/dashboard/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100%]">
      <SideBar />
      <div className="w-full flex-1 overflow-auto">
        <main className="bg-[#E9ECEF] ">{children}</main>
      </div>
    </div>
  );
}
