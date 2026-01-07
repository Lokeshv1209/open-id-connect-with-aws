"use client";
import { apiSlice } from "..";

const quizService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizCategoryList: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `questionnaire/list?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Quiz"],
    }),
    getCategoryQuestionById: builder.query({
      query: ({ id }) => ({
        url: `questionnaire/questions/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Quiz", id }],
    }),
    getQuestionResponseById: builder.query({
      query: ({ id }) => ({
        url: `questionnaire/saved-states?categoryId=${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Quiz", id }],
    }),
    createQuiz: builder.mutation({
      query: (body) => ({
        url: `questionnaire/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
});

export const {
  useGetQuizCategoryListQuery,
  useGetQuestionResponseByIdQuery,
  useGetCategoryQuestionByIdQuery,
  useCreateQuizMutation,
} = quizService;
