"use client";
import type {
  ApiResponse,
  GetSolvedUsersRequest,
  GetUsersRequest,
  PaginatedResponse,
  User,
} from "@/types/api-responses.types";

import { apiSlice } from "..";

const userService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query<ApiResponse<PaginatedResponse<User>>, GetUsersRequest>({
      query: ({ page = 1, limit = 10, search = "", isActive }) => ({
        url: `questionnaire/users-states?page=${page}&limit=${limit}&search=${search}${
          isActive !== undefined ? `&isActive=${isActive}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getSolvedQuizUserList: builder.query<
      ApiResponse<PaginatedResponse<User>>,
      GetSolvedUsersRequest
    >({
      query: ({ page = 1, limit = 10, quizId }) => ({
        url: `questionnaire/solved-states?page=${page}&limit=${limit}&quizId=${quizId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserListQuery, useGetSolvedQuizUserListQuery } = userService;
