"use client";
import { Loader2 } from "lucide-react";
import React from "react";

interface FullPageLoaderProps {
  /**
   * Whether the loader should be visible.
   * @default false
   */
  loading?: boolean;
  /**
   * Optional text to display below the spinner.
   */
  message?: string;
}

export default function Loader({ loading = false, message }: FullPageLoaderProps) {
  if (!loading) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
      {/* <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-gray-800/90 border border-gray-700 shadow-xl"> */}
      <Loader2 className="h-12 w-12 animate-spin text-[#1EB54C]" />
      {message && <p className="text-white text-lg font-medium">{message}</p>}
      {/* <p className="text-gray-400 text-sm">Please wait...</p> */}
      {/* </div> */}
    </div>
  );
}
