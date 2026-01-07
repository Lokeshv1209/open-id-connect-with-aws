"use client";
import { redirect, useSearchParams } from "next/navigation";
import React from "react";

import VerifyAdmin from "@/components/auth/VerifyAdmin";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token) {
    redirect("/login");
  }
  return <VerifyAdmin token={token} />;
}
