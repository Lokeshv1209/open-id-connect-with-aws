"use client";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import cardBG from "@/../public/cardBG.png";
import { transformCategories } from "@/common/helper";
import { useAppSelector } from "@/hooks/reduxHook";
import { showErrorToast } from "@/lib/toast";
import {
  useGetCategoryListQuery,
  useGetTopCategoryQuery,
} from "@/services/api-service/CategoryService";
import { useGetOrganizationListQuery } from "@/services/api-service/OrgService";
import type { Organization, OrganizationFormData } from "@/types/organization.types";

import { ChartPieDonut } from "../shared-component/ChartPieDonut";
import { Pagination } from "../shared-component/Pagination";
import { Button } from "../ui/button";
import Loader from "../ui/loader";
import type { ICategory } from "./org-cards/CategoryCards";
import CategoryCards from "./org-cards/CategoryCards";
import OrgCards from "./org-cards/OrgCards";
import AddCategory from "./side-popup/AddCategory";
import AddOrg from "./side-popup/AddOrg";

// Keep IColumns for backward compatibility with AddOrg component
export type IColumns = OrganizationFormData;

// Chart data interface
export interface IPieChartData {
  label: string;
  color: string;
  value: number;
}

export default function Org() {
  const { NavBarSearch, userInfo } = useAppSelector((state) => ({
    NavBarSearch: state.GlobalSearch.NavBarSearch,
    userInfo: state.userDetails.userInfo,
  }));
  const [addOrgPopup, setAddOrgPopup] = useState(false);
  const [addCategoryPopup, setAddCategoryPopup] = useState(false);

  const [categoryInfo, setCategoryInfo] = useState<ICategory>();
  const [topCategory, setTopCategory] = useState<IPieChartData[]>([]);
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [orgListData, setOrgListData] = useState<Organization[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const pageLimit = 9;

  //org list
  const {
    data: orgList,
    error,
    isLoading: orgListLoading,
  } = useGetOrganizationListQuery(
    {
      page: currentPage,
      limit: pageLimit,
      search: NavBarSearch,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (orgList?.data?.data) {
      setOrgListData(orgList?.data?.data);
      setTotalCount(orgList?.data?.pagination?.total);
    }
    if (error) {
      showErrorToast("Error While Fetching Organization List");
    }
  }, [orgList, error]);

  //category list
  const {
    data: cateGoryList,
    error: cateGoryError,
    isLoading: categoryLoading,
  } = useGetCategoryListQuery(
    {
      search: NavBarSearch,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (cateGoryError) {
      console.error("Error fetching category list:", cateGoryError);
      showErrorToast("Error While Fetching category List");
      setCategoryList([]); // Clear the list on error
    } else if (cateGoryList?.data) {
      setCategoryList(cateGoryList.data);
    }
  }, [cateGoryList, cateGoryError]);

  //top category list
  const {
    data: topCategoryList,
    error: topCategoryError,
    isLoading: isTopCategoryLoading,
  } = useGetTopCategoryQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (topCategoryError) {
      console.info("Error fetching top categories:", topCategoryError);
      showErrorToast("Error While Fetching Top Category List");
      setTopCategory([]);
    } else if (topCategoryList?.data?.length) {
      const topCategory = transformCategories(topCategoryList.data);
      setTopCategory(topCategory);
    }
  }, [topCategoryList, topCategoryError]);

  useEffect(() => {
    if (!addCategoryPopup) {
      setCategoryInfo(undefined);
    }
  }, [addCategoryPopup]);

  const handleEdit = (data: ICategory) => {
    console.info("Edit category:", data);
    setCategoryInfo(data);
    setAddCategoryPopup(true);
  };

  return (
    <div className="">
      <div
        className=" bg-cover relative flex max-md:flex-col max-md:gap-2 justify-between  px-7.5 py-9.25 rounded-b-xl"
        style={{
          backgroundImage: `url(${cardBG.src})`,
        }}
      >
        <div className="text-white flex flex-col">
          <h2 className="text-2xl 2xl:text-[30px] font-semibold ">Hello {userInfo?.name} !</h2>
          <p className="text-sm 2xl:text-[23px] font-medium">
            We are on a mission to help developers like you to build beautiful projects for FREE.
          </p>
        </div>
        <div>
          <Button variant="white" onClick={() => setAddOrgPopup(true)} className="p-0">
            <div className="flex py-2 px-3.25  items-center gap-1.5">
              <Plus />
              <span>Create Organizations</span>
            </div>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2.8fr_1fr] gap-6 p-6 ">
        <div className="relative">
          <div className="flex max-md:flex-col max-md:gap-2 items-center justify-between px-5 py-3 rounded-t-3xl bg-white">
            <div className="">
              <h3 className="text-md 2xl:text-xl font-medium text-[#064738]">
                Organization Management
              </h3>
              <p className="text-[#828C89] text-sm">
                Manage and oversee all organizations within the platform
              </p>
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
          <div className="bg-[#FFFFFF99] 2xl:h-[80.8vh]  rounded-b-3xl">
            {orgListData?.length ? (
              <OrgCards orgData={orgListData} />
            ) : (
              <div className="flex flex-col justify-center items-center  h-full">
                <h2 className="text-xl">Oops!</h2>
                <h3 className="text-2xl font-semibold">No Organization Found</h3>
              </div>
            )}
          </div>
          <Loader loading={orgListLoading} />
        </div>

        {/* right side  */}
        <div className=" w-full flex flex-col justify-start items-start mx-auto gap-6">
          <div className="w-[100%] relative bg-[#FFFF] rounded-[16px] p-5 flex flex-col justify-start items-start gap-[10px]">
            <span className="text-md 2xl:text-xl font-medium text-[#064738]">Top Categories</span>
            <div className="flex items-center gap-4 w-full max-md:flex-col ">
              <ChartPieDonut data={topCategory} />
              <div className="flex flex-col gap-3 w-[50%]">
                {topCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#606060] text-xs font-normal">{item.label}</span>
                    </div>
                    {/* Right side: value */}
                    <span className="font-normal text-sm text-[#000000]">{item.value} Posts</span>
                  </div>
                ))}
              </div>
              <Loader loading={isTopCategoryLoading} />
            </div>
          </div>
          <div className="w-full rounded-[16px] ">
            <div className="flex justify-between items-center px-5 py-3.25  rounded-t-[16px] bg-white">
              {/* category header */}
              <div>
                <div className="font-medium text-md 2xl:text-xl text-[#064738]">
                  Categories List
                </div>
                <div className="text-[#828C89] text-xs  font-normal">
                  Latest Customer insights and reviews
                </div>
              </div>
              <Button
                onClick={() => {
                  setAddCategoryPopup(true);
                }}
                variant="gradientGreen"
                size="lg"
                className=""
              >
                <div className="flex py-1 items-center gap-2 cursor-pointer">
                  <Plus />
                  <span>Add Categories</span>
                </div>
              </Button>
            </div>
            <div className="  relative bg-[#FFFFFF99] rounded-b-3xl h-[58.3vh] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] w-[100%] inline-block">
              {categoryList && cateGoryList?.data?.length > 0 ? (
                <CategoryCards items={categoryList} onEdit={handleEdit} />
              ) : (
                <div className="flex items-center h-full justify-center font-medium text-xl text-[#064738]">
                  No Category Found
                </div>
              )}
              <Loader loading={categoryLoading} />
            </div>
          </div>
        </div>
      </div>

      {addOrgPopup && <AddOrg handleClose={() => setAddOrgPopup(false)} />}
      {addCategoryPopup && (
        <AddCategory categoryInfo={categoryInfo} handleClose={() => setAddCategoryPopup(false)} />
      )}
    </div>
  );
}
