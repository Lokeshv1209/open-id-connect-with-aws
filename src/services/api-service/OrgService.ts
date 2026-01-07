"use client";
import { apiSlice } from "..";

const orgService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationList: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `organization/list?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Org"],
    }),
    getOrganizationById: builder.query({
      query: ({ id }) => ({
        url: `organization/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Org", id }],
    }),
    createOrg: builder.mutation({
      query: (body) => ({
        url: `organization/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Org"],
    }),
    updateOrg: builder.mutation({
      query: (body) => ({
        url: `organization/update`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Org"],
    }),
    deleteOrganizationById: builder.mutation({
      query: ({ orgId }) => ({
        url: `organization/${orgId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Org"],
    }),
  }),
});

export const {
  useCreateOrgMutation,
  useGetOrganizationListQuery,
  useGetOrganizationByIdQuery,
  useUpdateOrgMutation,
  useDeleteOrganizationByIdMutation,
} = orgService;
