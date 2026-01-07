import { type ClassValue, clsx } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { clearGlobalSearch } from "@/store/slice/GlobalSearchSlice";
import { clearInfo } from "@/store/slice/userDetails";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const logout = () => (dispatch: any) => {
  dispatch(clearInfo());
  dispatch(clearGlobalSearch());
  localStorage.removeItem("persist:root");
  redirect("/login");
};
