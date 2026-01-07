"use client";
import React, { useEffect } from "react";

import Login from "@/components/auth/Login";
import { useAuth } from "@/hooks/useAuth";

function LoginPage() {
  const { isAuthenticated, navigateBasedOnRole } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigateBasedOnRole();
    }
  }, [isAuthenticated, navigateBasedOnRole]);

  return <Login />;
}

export default LoginPage;
