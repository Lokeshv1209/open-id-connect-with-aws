"use client";
import { Plus } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";

import SearchIcon from "@/../public/SearchIcon.svg";
import { showErrorToast } from "@/lib/toast";
import { useGetUserListQuery } from "@/services/api-service/UserService";
import type { User } from "@/types/api-responses.types";

import { Pagination } from "../shared-component/Pagination";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import Loader from "../ui/loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

// Extend the API User type with UI-specific fields
export interface IUser extends User {
  profileUrl?: string | null;
  totalPosts?: string;
  questionnairesCompleted?: string;
}

export interface HeadCell {
  id: string;
  key: keyof IUser;
  label: string;
  cellRender: (_row: IUser) => ReactNode;
  hide?: boolean;
}

export const headCellList: readonly HeadCell[] = [
  {
    id: "uid",
    key: "userId",
    label: "#UID",
    cellRender: (row) => (
      <span className="text-sm text-gray-600 font-medium">{row.userId?.slice(0, 4)}</span>
    ),
  },
  {
    id: "userName",
    key: "name",
    label: "User Name",
    cellRender: (row) => {
      return (
        <div className="flex items-center gap-3">
          <p className="flex justify-center items-center rounded-full p-3 w-10 h-10 bg-green-400">
            {row.name?.charAt(0).toUpperCase()}
          </p>
          <span className="font-medium text-gray-900 text-sm">{row.name}</span>
        </div>
      );
    },
    hide: false,
  },
  {
    id: "email",
    key: "email",
    label: "Email",
    cellRender: (row) => <span className="text-sm text-gray-600">{row.email}</span>,
  },
  {
    id: "joiningDate",
    key: "createdAt",
    label: "Joining Date",
    cellRender: (row) => (
      <span className="text-sm text-gray-600">
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
      </span>
    ),
  },
  {
    id: "status",
    key: "isActive",
    label: "Status",
    cellRender: (row) => (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "totalPost",
    key: "totalPosts",
    label: "Total Post",
    cellRender: (row) => <span className="text-sm text-gray-600">{row.totalPosts || "0"}</span>,
  },
  {
    id: "questionnairesCompleted",
    key: "questionnairesCompleted",
    label: "Questionnaires Completed",
    cellRender: (row) => (
      <span className="text-sm text-gray-600">{row.questionnairesCompleted || "0"}</span>
    ),
  },
];

export default function Users() {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
    statusFilter: "",
    search: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filter.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search: debouncedSearch }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearch]);

  const [userList, setUserList] = useState<IUser[]>([]);
  const pageLimit = 10;
  const {
    data: userListRes,
    error: userError,
    isLoading: userListLoading,
  } = useGetUserListQuery(
    {
      page: currentPage,
      limit: pageLimit,
      isActive:
        filter?.statusFilter === "active"
          ? true
          : filter?.statusFilter === "inactive"
            ? false
            : undefined,
      search: filter?.search,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (userListRes?.data?.data) {
      // Map API response to IUser format with default values for UI fields
      const mappedUsers: IUser[] = userListRes.data.data.map((user: User) => ({
        ...user,
        profileUrl: null,
        totalPosts: "0",
        questionnairesCompleted: "0",
      }));
      setUserList(mappedUsers);
      setTotalCount(userListRes?.data?.total || 0);
    }
    if (userError) {
      console.error("Error fetching user list:", userError);
      showErrorToast("Error While Fetching User List");
    }
  }, [userListRes, userError]);

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Your existing header code */}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-[#064738] text-xl font-medium">Users Management</h1>
          <p className="text-[15px] font-normal text-[#606060]">
            Manage and oversee organization&apos;s Users.
          </p>
        </div>
        <div>
          <Button className="text-[15px] font-medium " variant="gradientGreen">
            <div className="flex items-center gap-1">
              <Plus />
              <span>Export</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Your existing table structure with updated content */}
      <div className="relative">
        <div className="flex max-md:flex-col max-md:gap-2 items-center justify-between px-5 py-3.5 rounded-t-3xl bg-white">
          <div className="flex gap-2.5 items-center">
            <div className="flex items-center border-[1px] border-[#0E0F111A] font-[400] py-1 px-2 max-xl:py-1 text-[12px] max-xl:text-[11px] rounded-md">
              <Image className="w-5 h-5" src={SearchIcon} alt="Search" />
              <Input
                className="w-[17rem] text-sm text-[#00110D99] bg-transparent outline-none border-none"
                placeholder="Search User Name, Category name..."
                onChange={(e) => setDebouncedSearch(e?.target?.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-0 bg-gray-200 rounded-lg p-1 w-fit">
              <Button
                variant={filter?.statusFilter === "" ? "gradientGreen" : "ghost"}
                className="w-[4.75rem]"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, statusFilter: "" }));
                }}
              >
                All
              </Button>
              <Button
                variant={filter?.statusFilter === "active" ? "gradientGreen" : "ghost"}
                className="w-[4.75rem]"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, statusFilter: "active" }));
                }}
              >
                Active
              </Button>
              <Button
                variant={filter?.statusFilter === "inactive" ? "gradientGreen" : "ghost"}
                className="w-[4.75rem]"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, statusFilter: "inactive" }));
                }}
              >
                Inactive
              </Button>
            </div>
            <Pagination
              totalItems={totalCount}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              pageLimit={pageLimit}
            />
          </div>
        </div>

        {/* Rest of your table code remains the same */}
        <div className="bg-[#FFFFFF99] rounded-b-3xl">
          {userList?.length ? (
            <div className=" bg-[#FFFFFF3D] p-5 rounded-b-3xl shadow-sm">
              <Table className="border-none overflow-hidden">
                <TableHeader>
                  <TableRow className="bg-[#F0F0F0]">
                    <TableHead className="font-medium text-gray-700 py-4 px-7.75">
                      <div className="">
                        <Checkbox />
                      </div>
                    </TableHead>
                    {headCellList.map((headCell) => {
                      if (headCell.hide) {
                        return null;
                      }
                      return (
                        <TableHead
                          key={headCell?.key}
                          className="font-medium text-gray-700 py-3.5 px-4 text-left"
                        >
                          {headCell.label}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody className="relative top-2.5">
                  {userList.map((user) => (
                    <TableRow
                      key={user.userId}
                      className="[&_td:last-child]:rounded-r-2xl [&_td:first-child]:rounded-l-2xl border-[#FFFFFF3D] border-b-[10px] bg-white"
                    >
                      <TableCell className="py-5 px-8">
                        <Checkbox />
                      </TableCell>
                      {headCellList.map((headCell) => {
                        if (headCell.hide) {
                          return null;
                        }
                        return (
                          <TableCell
                            className="py-4 px-6"
                            key={headCell.label}
                            id={headCell.key}
                            scope="row"
                          >
                            <div className="!w-full max-w-[260px] overflow-hidden text-ellipsis !block">
                              {headCell.cellRender(user)}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-screen">
              <h2 className="text-xl">Oops!</h2>
              <h3 className="text-2xl font-semibold">No Users Found</h3>
            </div>
          )}
        </div>
        <Loader loading={userListLoading} />
      </div>
    </div>
  );
}
