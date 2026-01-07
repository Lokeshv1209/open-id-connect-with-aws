"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loader from "@/components/ui/loader";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, navigateBasedOnRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigateBasedOnRole();
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, navigateBasedOnRole, router]);

  return <Loader loading={true} />;
}
