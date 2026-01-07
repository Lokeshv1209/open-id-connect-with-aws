"use client";
import type React from "react";

import AuthGuard from "@/components/AuthGuard";
import Footer from "@/components/dashboard/Footer";
import { Navbar } from "@/components/dashboard/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex flex-col h-screen">
        {/* bg-[url(/BackGroundImg.png)] bg-cover */}
        <Navbar />
        {/* <div className="flex-1 flex"> */}
        <div className="w-full flex-1 overflow-auto">
          <main className=" bg-[#E9ECEF] ">{children}</main>
          {/* </div> */}
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}
