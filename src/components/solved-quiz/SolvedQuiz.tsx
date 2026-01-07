"use client";
import { Plus } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";

import SearchIcon from "@/../public/SearchIcon.svg";
import { showErrorToast } from "@/lib/toast";
import { useGetSolvedQuizUserListQuery } from "@/services/api-service/UserService";

import { Pagination } from "../shared-component/Pagination";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import Loader from "../ui/loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ViewResponse from "./side-popup/ViewResponse";

export interface ISolvedUserType {
  setId: string;
  assignedAt: string;
  userId: string;
  name: string;
  email: string;
  profileUrl: string | null;
  categoryId: string;
  categoryName: string;
}

export interface HeadCell {
  id: string;
  label: string;
  key: string;
  cellRender: (_row: ISolvedUserType) => ReactNode;
  hide?: boolean;
  //   showInSearch?: boolean;
  //   searchFiedtType?: 'input' | 'select';
  //   searchFieldOptions?: { label: string; value: string }[];
}

const headCellList: readonly HeadCell[] = [
  {
    id: "UserName",
    label: "User Name",
    key: "user_name",
    cellRender: (row) => {
      return (
        <div className="flex items-center gap-3">
          <p className="flex justify-center items-center rounded-full p-3 w-10 h-10 bg-green-400">
            {row.name?.charAt(0).toUpperCase()}
          </p>
          <span className="font-medium text-[#064738] text-md">{row.name}</span>
        </div>
      );
    },
    hide: false,
  },
  {
    id: "Email",
    label: "Email",
    key: "email",
    cellRender: (row) => {
      return <span className="font-normal text-[#1C1C41] text-sm">{row.email}</span>;
    },
    hide: false,
  },
  {
    id: "Category",
    label: "Category",
    key: "category",
    cellRender: (row) => {
      return <span className="font-normal text-[#455468] text-sm">{row.categoryName}</span>;
    },
    hide: false,
  },
  // {
  //   id: "CompletedDate",
  //   label: "Completed Date",
  //   key: "completed_date",
  //   cellRender: (row) => {
  //     return <span className="font-normal text-[#1C1C41] text-sm">{row.completedDate || "-"}</span>;
  //   },
  //   hide: false,
  // },
];

export default function SolvedQuiz() {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [solvedUserList, setSolvedUserList] = useState<ISolvedUserType[]>([]);
  const [filter, setFilter] = useState({
    search: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filter.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prev) => {
        return { ...prev, search: debouncedSearch };
      });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearch]);
  const pageLimit = 10;
  const [openViewResponse, setOpenViewResponse] = useState(false);

  const {
    data: solvedUserListRes,
    error: solvedUserError,
    isLoading: solvedUserListLoading,
  } = useGetSolvedQuizUserListQuery(
    {
      page: currentPage,
      limit: pageLimit,
      quizId: "", // TODO: Add quizId when available
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (solvedUserListRes?.data?.data) {
      console.info("Organization list:", solvedUserListRes?.data?.data);
      // Map User data to ISolvedUserType format
      const mappedData: ISolvedUserType[] = solvedUserListRes.data.data.map((user: any) => ({
        setId: user.setId || "",
        assignedAt: user.assignedAt || "",
        userId: user.id || "",
        name: user.name || "",
        email: user.email || "",
        profileUrl: user.profileUrl || null,
        categoryId: user.categoryId || "",
        categoryName: user.categoryName || "",
      }));
      setSolvedUserList(mappedData);
      setTotalCount((solvedUserListRes?.data as any)?.pagination?.totalItems || 0);
    }
    if (solvedUserError) {
      console.info("Error fetching org list:", solvedUserError);
      showErrorToast("Error While Fetching Organization List");
    }
  }, [solvedUserListRes, solvedUserError]);

  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-[#064738] text-xl font-medium">Solved Questionnaire</h1>
          <p className="text-[15px] font-normal text-[#606060]">
            Explore and Analysis the Responses
          </p>
        </div>
        <div>
          <Button
            className="text-[15px] font-medium "
            variant="gradientGreen"
            // onClick={() => setOpenCreateQuiz(true)}
          >
            <div className="flex items-center gap-1">
              <Plus />
              <span>Export</span>
            </div>
          </Button>
        </div>
      </div>
      <div className="relative">
        <div className="flex max-md:flex-col max-md:gap-2 items-center justify-between px-5 py-3.5 rounded-t-3xl bg-white">
          <div className="flex gap-2.5 items-center">
            <div className="flex items-center  border-[1px] border-[#0E0F111A]  font-[400] py-1 px-2  max-xl:py-1 text-[12px] max-xl:text-[11px] rounded-md">
              <Image className="w-5 h-5" src={SearchIcon} alt="" />
              <Input
                className="w-[17rem] text-sm  text-[#00110D99] bg-transparent outline-none border-none"
                placeholder="Search User Name, Category name..."
                onChange={(e) => {
                  setDebouncedSearch(e?.target?.value);
                }}
              />
            </div>
            {/* <Button variant="floating" className="rounded-md h-[46px] w-[46px]">
              <Funnel className="" />
            </Button> */}
            {/* <h1 className="text-[#064738] text-xl font-medium">Category List</h1> */}
          </div>
          <div className="flex items-center">
            <Pagination
              totalItems={totalCount}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              pageLimit={pageLimit}
            />
          </div>
        </div>
        <div className="bg-[#FFFFFF99]  rounded-b-3xl">
          {solvedUserList?.length ? (
            <div className=" py-2.5 bg-[#FFFFFF3D] px-5 rounded-b-3xl shadow-sm ">
              <Table className="border-none overflow-hidden">
                <TableHeader>
                  <TableRow className="bg-[#F0F0F0] [&_th:last-child]:rounded-r-2xl [&_th:first-child]:rounded-l-2xl ">
                    <TableHead className="font-medium text-gray-700 py-4 px-7.75 ">
                      <div className="">
                        <Checkbox
                        // checked={isSelectAll || selectAllData}
                        // onChange={(_, checked) => selectAll(checked)}
                        />
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
                    <TableHead className="font-medium text-gray-700 py-3.5 px-4 text-left">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="relative top-2.5">
                  {solvedUserList.map((user, index) => (
                    <TableRow
                      key={index}
                      className="[&_td:last-child]:rounded-r-2xl [&_td:first-child]:rounded-l-2xl border-[#FFFFFF3D] border-b-[10px]  bg-white"
                    >
                      <TableCell className="py-5 px-8">
                        <Checkbox
                        //   checked={isItemSelected}
                        //   aria-checked={isItemSelected}
                        //   onChange={() => handleRowChecked(row, isItemSelected)}
                        //   inputProps={{
                        //     "aria-labelledby": labelId,
                        //   }}
                        />
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
                            <div
                              className="!w-full max-w-[260px] overflow-hidden
                                 text-ellipsis !block"
                            >
                              {headCell.cellRender(user)}
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <Button
                          onClick={() => setOpenViewResponse(true)}
                          size="sm"
                          variant="gradientGreen"
                        >
                          View Response
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center  h-full">
              <h2 className="text-xl">Oops!</h2>
              <h3 className="text-2xl font-semibold">No Organization Found</h3>
            </div>
          )}
        </div>
        <Loader loading={solvedUserListLoading} />
      </div>
      {openViewResponse && <ViewResponse handleClose={() => setOpenViewResponse(false)} />}
    </div>
  );
}
