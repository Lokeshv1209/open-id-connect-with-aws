"use client";
import { apiSlice } from "@/services/index";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email?: string; mobile?: string; password: string }) => ({
        url: "auth/web-login",
        method: "POST",
        body: credentials,
      }),
    }),
    activate: builder.mutation({
      query: (payload: { password: string; token: string }) => ({
        url: "workspaces/activate",
        method: "POST",
        headers: {
          Authorization: `Bearer ${payload?.token}`,
        },
        body: { password: payload?.password },
      }),
    }),
    refreshToken: builder.query({
      query: (payload: { token: string }) => ({
        url: "auth/refresh-token",
        method: "GET",
        headers: {
          Authorization: `Bearer ${payload?.token}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useActivateMutation, useRefreshTokenQuery } = authApi;
