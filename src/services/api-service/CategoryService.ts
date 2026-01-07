"use client";
import { apiSlice } from "..";

const categoryService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryList: builder.query({
      query: ({ search = "" }) => ({
        url: `post/category-list?search=${search}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Category"],
    }),
    getTopCategory: builder.query({
      query: () => ({
        url: "organization/top-category",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: "organization/create-category",
        method: "POST",

        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (body) => ({
        url: "organization/update-category",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `organization/category/${categoryId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoryListQuery,
  useGetTopCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryService;
