import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { logout } from "@/lib/utils";
import { setToken } from "@/store/slice/userDetails";
import { store } from "@/store/store";

let refreshingToken: Promise<string | null> | null = null;

// Create base query with dynamic base URL
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002/api",
  prepareHeaders: (headers) => {
    const token = store.getState().userDetails?.token?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueyWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as any;
    const expiredJwt = errorData?.message === "jwt expired";

    if (expiredJwt) {
      // If no refresh in progress, start one
      if (!refreshingToken) {
        const token = store.getState().userDetails?.token?.refreshToken;
        refreshingToken = (async () => {
          try {
            const res = await fetchBaseQuery({
              baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002/api",
            })(
              {
                url: "auth/refresh-token",
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              },
              api,
              extraOptions
            );

            const responseData = res.data as any;
            if (responseData?.code === 200) {
              store.dispatch(setToken(responseData.data));
              return responseData.data.accessToken;
            } else {
              logout();
              return null;
            }
          } finally {
            // Reset after refresh attempt completes
            refreshingToken = null;
          }
        })();
      }

      // Wait for the refresh token promise
      const newToken = await refreshingToken;
      if (newToken) {
        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        logout();
      }
    } else {
      logout();
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  tagTypes: ["Org", "Quiz", "Category", "User"],
  baseQuery: baseQueyWithReauth,
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
