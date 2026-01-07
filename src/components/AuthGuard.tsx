"use client";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAppSelector } from "@/hooks/reduxHook";
import { clearInfo } from "@/store/slice/userDetails";
import { store } from "@/store/store";

import Loader from "./ui/loader";

interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const {
    userInfo,
    token: { accessToken, refreshToken },
  } = useAppSelector((state) => state.userDetails);

  useEffect(() => {
    const checkAuth = async () => {
      const token = accessToken;

      // Public paths that don't require authentication
      const publicPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];
      const superAdmin = ["/dashboard"];
      const orgAdmin = ["/feeds", "/users", "/questionnaires", "/solved-quiz"];
      const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
      const superAdminPath = superAdmin.some((path) => pathname.startsWith(path));
      const orgAdminPath = orgAdmin.some((path) => pathname.startsWith(path));

      if (!token) {
        // No token
        if (!isPublicPath) {
          router.replace("/login");
          return;
        }
        setIsLoading(false);
        return;
      }

      // Validate token
      try {
        const decoded = jwtDecode<DecodedToken>(refreshToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("persist:root");
          if (!isPublicPath) {
            router.replace("/login");
            return;
          }
        } else {
          // Redirect to dashboard if on login page with valid token
          if (pathname === "/login" && userInfo?.role == "super_admin") {
            router.replace("/dashboard");
            return;
          } else if (pathname === "/login" && userInfo?.role == "org_admin") {
            router.replace("/questionnaires");
            return;
          }

          if (
            (superAdminPath && userInfo?.role == "org_admin") ||
            (orgAdminPath && userInfo?.role == "super_admin")
          ) {
            store.dispatch(clearInfo());
            router.replace("/unauthorized");
            return;
          }
        }
      } catch {
        localStorage.removeItem("persist:root");
        if (!isPublicPath) {
          router.replace("/login");
          return;
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router, accessToken, refreshToken, userInfo?.role]);

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  return <>{children}</>;
}
